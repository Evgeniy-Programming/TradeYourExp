package raiting

import (
	"Trade-y-exp/internal/models"
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
)

// func (rr *RaitRepository) ChangeRait(ctx context.Context, request models.LogicRaitRequest) error {
// 	tx, err := rr.db.BeginTx(ctx, nil)
// 	if err != nil {
// 		return err
// 	}
// 	defer tx.Rollback()

// 	var lastRaiting float32
// 	err = tx.QueryRowContext(ctx, `SELECT raiting FROM users WHERE id = $1 FOR UPDATE`, request.ReceivedId).Scan(&lastRaiting)
// 	if err != nil {
// 		return err
// 	}
// 	newRait := lastRaiting + float32(request.Mark) // ДОРАБОТКА РАСЧЕТА
// 	newId := uuid.New()
// 	_, err = tx.ExecContext(ctx, `
// 		INSERT INTO raiting (id, received_id, sent_id, last_raiting, new_raiting)
// 		VALUES ($1, $2, $3, $4, $5)
// 		ON CONFLICT (id)
// 		DO UPDATE SET
// 			last_raiting = EXCLUDED.last_raiting,
// 			new_raiting = EXCLUDED.new_raiting,
// 			created_at = NOW()`,
// 		newId, request.ReceivedId, request.SentId, lastRaiting, newRait)
// 	if err != nil {
// 		return err
// 	}

// 	_, err = tx.ExecContext(ctx, `UPDATE users SET raiting = $1 WHERE id = $2`, newRait, request.ReceivedId)

// 	return tx.Commit()
// }

func (rr *RaitRepository) UpdateRait(ctx context.Context, request models.LogicRaitRequest) error {
	tx, err := rr.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var lastRaiting float32
	err = tx.QueryRowContext(ctx, `SELECT raiting FROM users WHERE id = $1 FOR UPDATE`, request.ReceivedId).Scan(&lastRaiting)
	if err != nil {
		return err
	}
	newRait := float32(request.Mark) // admin set
	newId := uuid.New()
	_, err = tx.ExecContext(ctx, `
		INSERT INTO raiting (id, received_id, sent_id, last_raiting, new_raiting) 
		VALUES ($1, $2, $3, $4, $5) 
		ON CONFLICT (id) 
		DO UPDATE SET 
			last_raiting = EXCLUDED.last_raiting, 
			new_raiting = EXCLUDED.new_raiting,
			created_at = NOW()`,
		newId, request.ReceivedId, request.SentId, lastRaiting, newRait)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, `UPDATE users SET raiting = $1 WHERE id = $2`, newRait, request.ReceivedId)

	return tx.Commit()
}

func (rr *RaitRepository) ChangeRait(ctx context.Context, request models.LogicRaitRequest) error {
	bonus, _ := rr.getStreakBonus(ctx, request.ReceivedId, request.Mark)

	tx, err := rr.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var lastRaiting float32
	err = tx.QueryRowContext(ctx, `SELECT raiting FROM users WHERE id = $1 FOR UPDATE`, request.ReceivedId).Scan(&lastRaiting)
	if err != nil {
		return err
	}
	newRait := lastRaiting + float32(request.Mark) + bonus

	newId := uuid.New()

	// Мы не обновляем его постоянно. Он останется таким, каким был зафиксирован
	// при завершении предыдущей сессии (или NULL, если ты добавишь отдельную логику закрытия сессии).
	_, err = tx.ExecContext(ctx, `
		INSERT INTO raiting (id, received_id, sent_id, last_raiting, new_raiting) 
		VALUES ($1, $2, $3, $4, $5) 
		ON CONFLICT (id) 
		DO UPDATE SET 
			last_raiting = EXCLUDED.last_raiting, 
			new_raiting = EXCLUDED.new_raiting,
			created_at = NOW()`,
		newId, request.ReceivedId, request.SentId, lastRaiting, newRait)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, `UPDATE users SET raiting = $1 WHERE id = $2`, newRait, request.ReceivedId)
	if err != nil {
		return err
	}

	return tx.Commit()
}

// getStreakBonus возвращает: (бонус к рейтингу, текущая длина серии)
func (rr *RaitRepository) getStreakBonus(ctx context.Context, userID string, newMark int) (float32, int) {
	key := fmt.Sprintf("rating:streak:%s", userID)
	var currentStreak int
	var lastMark int

	// 1. Проверяем активную сессию в Redis
	redisData, err := rr.redis.HGetAll(ctx, key).Result()
	if err == nil && len(redisData) > 0 {
		lastMark, _ = strconv.Atoi(redisData["last_mark"])
		currentStreak, _ = strconv.Atoi(redisData["count"])

		if lastMark == newMark {
			currentStreak++ // Сессия продолжается
		} else {
			currentStreak = 1 // Серия прервана другой оценкой, начинаем новую
		}
	} else {
		// 2. Redis пуст (сессия истекла или это первая оценка).
		// Идем в Postgres за ПОСЛЕДНЕЙ записью, чтобы взять исторический series.
		// !!! Убедись, что имена таблиц и колонок совпадают с твоими !!!
		query := `SELECT new_raiting, series FROM raiting WHERE received_id = $1 ORDER BY created_at DESC LIMIT 1`

		var dbMark, dbSeries int
		err = rr.db.QueryRowContext(ctx, query, userID).Scan(&dbMark, &dbSeries)

		// Так как сессия в Redis истекла (прошло 48 часов), мы начинаем новую серию с 1.
		// Переменная dbSeries прочитана для истории/логики, но текущая серия сбрасывается.
		currentStreak = 1
		lastMark = newMark
	}

	// 3. Обновляем ТОЛЬКО Redis (это наше "живое" хранилище активной сессии)
	if rr.redis != nil {
		pipe := rr.redis.Pipeline()
		pipe.HSet(ctx, key, "last_mark", lastMark)
		pipe.HSet(ctx, key, "count", currentStreak)
		pipe.Expire(ctx, key, 48*time.Hour) // Сессия живет ровно 48 часов
		pipe.Exec(ctx)                      // Ошибку игнорируем, чтобы не ронять основной процесс
	}

	// 4. Расчет бонуса: серия * 0.01
	bonus := float32(currentStreak) * 0.01

	return bonus, currentStreak
}
