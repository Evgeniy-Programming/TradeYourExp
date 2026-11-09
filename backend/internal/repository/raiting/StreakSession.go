package raiting

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

// saveStreak кратко делает запись в Redis для активной сессии голосования.
// Она сохраняет последний голос, количество голосов в серии и идентификатор истории голосования.
// Также устанавливает время истечения сессии и создает запись в отслеживающем списке истечений.
func (rr *RaitRepository) saveStreak(ctx context.Context, userID, ratingID string, mark, count int) error {
	activeKey := rr.streakPrefix + userID
	pendingKey := rr.streakPrefix + "pending:" + userID
	data := map[string]interface{}{"last_mark": mark, "count": count, "rating_id": ratingID}
	_, err := rr.redis.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
		pipe.HSet(ctx, activeKey, data)
		pipe.Expire(ctx, activeKey, streakTimeout)
		pipe.HSet(ctx, pendingKey, map[string]interface{}{"count": count, "rating_id": ratingID})
		pipe.ZAdd(ctx, rr.streakPrefix+"expires", redis.Z{
			Score: float64(time.Now().Add(streakTimeout).UnixMilli()), Member: userID,
		})
		return nil
	})
	return err
}

// persistExpiredStreak кратко делает запись в SQL для истекшей сессии голосования.
// Она проверяет, что сессия действительно истекла, и что активная сессия больше не существует.
// Если сессия была сохранена в Redis, она обновляет соответствующую запись в таблице raiting.
func (rr *RaitRepository) persistExpiredStreak(ctx context.Context, userID string) error {
	expiresKey := rr.streakPrefix + "expires"
	due, err := rr.redis.ZScore(ctx, expiresKey, userID).Result()
	if errors.Is(err, redis.Nil) {
		return nil
	}
	if err != nil {
		return err
	}
	if due > float64(time.Now().UnixMilli()) {
		return nil
	}
	active, err := rr.redis.Exists(ctx, rr.streakPrefix+userID).Result()
	if err != nil || active != 0 {
		return err
	}
	pendingKey := rr.streakPrefix + "pending:" + userID
	data, err := rr.redis.HGetAll(ctx, pendingKey).Result()
	if err != nil {
		return err
	}
	if len(data) == 0 {
		return fmt.Errorf("expired streak snapshot missing for %s", userID)
	}
	count, err := strconv.Atoi(data["count"])
	if err != nil || count < 1 {
		return errors.New("invalid pending streak count")
	}
	result, err := rr.db.ExecContext(ctx, `UPDATE raiting SET series = $1 WHERE id = $2 AND received_id = $3`,
		count, data["rating_id"], userID)
	if err != nil {
		return err
	}
	updated, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if updated != 1 {
		return fmt.Errorf("session history row %s not found", data["rating_id"])
	}
	_, err = rr.redis.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
		pipe.Del(ctx, pendingKey)
		pipe.ZRem(ctx, expiresKey, userID)
		return nil
	})
	return err
}

// RunStreakWorker кратко это фоновый воркер, который
// периодически проверяет истекшие сессии голосования и сохраняет их в SQL. Он использует Redis для хранения активных сессий и их истечения.
func (rr *RaitRepository) RunStreakWorker(ctx context.Context) {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		if err := rr.flushExpiredStreaks(ctx); err != nil && ctx.Err() == nil {
			log.Printf("persist rating sessions: %v", err)
		}
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		}
	}
}

func (rr *RaitRepository) flushExpiredStreaks(ctx context.Context) error {
	users, err := rr.redis.ZRangeByScore(ctx, rr.streakPrefix+"expires", &redis.ZRangeBy{
		Min: "-inf", Max: strconv.FormatInt(time.Now().UnixMilli(), 10), Count: 100,
	}).Result()
	if err != nil {
		return err
	}
	var failures []error
	for _, userID := range users {
		err := func() error {
			operationCtx, cancel := context.WithTimeout(ctx, streakOperationTimeout)
			defer cancel()
			unlock, err := rr.lockStreak(operationCtx, userID)
			if err != nil {
				return err
			}
			defer unlock()
			return rr.persistExpiredStreak(operationCtx, userID)
		}()
		if err != nil {
			failures = append(failures, err)
		}
	}
	return errors.Join(failures...)
}

// lockStreak кратко это блокировка сессии голосования в Redis.
// Она гарантирует, что только один воркер может изменять серию
// голосов для конкретного пользователя в один момент времени. Если сессия уже заблокирована другим воркером, текущий воркер будет ждать разблокировки.
func (rr *RaitRepository) lockStreak(ctx context.Context, userID string) (func(), error) {
	if rr.redis == nil {
		return nil, errors.New("Redis is required for rating sessions")
	}
	key := rr.streakPrefix + "lock:" + userID
	token := uuid.NewString()
	ticker := time.NewTicker(25 * time.Millisecond)
	defer ticker.Stop()
	for {
		locked, err := rr.redis.SetNX(ctx, key, token, 30*time.Second).Result()
		if err != nil {
			return nil, err
		}
		if locked {
			return func() {
				releaseCtx, cancel := context.WithTimeout(context.Background(), time.Second)
				defer cancel()
				rr.redis.Eval(releaseCtx, `
					if redis.call('GET', KEYS[1]) == ARGV[1] then
						return redis.call('DEL', KEYS[1])
					end
					return 0`, []string{key}, token)
			}, nil
		}
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-ticker.C:
		}
	}
}
