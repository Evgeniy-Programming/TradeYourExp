package raiting

import (
	"Trade-y-exp/internal/models"
	"context"
	"database/sql"
	"errors"
	"strconv"
	"time"

	"github.com/google/uuid"
)

func (rr *RaitRepository) UpdateRait(ctx context.Context, request models.LogicRaitRequest) error {
	tx, err := rr.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var lastRaiting float64
	if err := tx.QueryRowContext(ctx, `SELECT raiting FROM users WHERE id = $1 FOR UPDATE`, request.ReceivedId).Scan(&lastRaiting); err != nil {
		return err
	}
	newRait := float64(request.Mark)
	if _, err := tx.ExecContext(ctx, `
		INSERT INTO raiting (id, received_id, sent_id, last_raiting, new_raiting)
		VALUES ($1, $2, $3, $4, $5)`,
		uuid.New(), request.ReceivedId, request.SentId, lastRaiting, newRait); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE users SET raiting = $1 WHERE id = $2`, newRait, request.ReceivedId); err != nil {
		return err
	}
	return tx.Commit()
}

func (rr *RaitRepository) ChangeRait(ctx context.Context, request models.LogicRaitRequest) error {
	ctx, cancel := context.WithTimeout(ctx, streakOperationTimeout)
	defer cancel()
	// сессия голосования может быть заблокирована другим воркером, поэтому нужно ждать разблокировки
	unlock, err := rr.lockStreak(ctx, request.ReceivedId)
	if err != nil {
		return err
	}
	defer unlock()

	if err := rr.persistExpiredStreak(ctx, request.ReceivedId); err != nil {
		return err
	}
	tx, err := rr.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var lastRaiting float64
	if err := tx.QueryRowContext(ctx, `SELECT raiting FROM users WHERE id = $1 FOR UPDATE`, request.ReceivedId).Scan(&lastRaiting); err != nil {
		return err
	}
	var currentCount int
	if err := tx.QueryRowContext(ctx, `SELECT COUNT(*) FROM raiting WHERE received_id = $1`, request.ReceivedId).Scan(&currentCount); err != nil {
		return err
	}
	bonus, series, err := rr.getStreakBonus(ctx, tx, request.ReceivedId, request.Mark)
	if err != nil {
		return err
	}
	newRait := calculateRating(lastRaiting, request.Mark, bonus, currentCount)
	newID := uuid.NewString()
	if _, err := tx.ExecContext(ctx, `
		INSERT INTO raiting (id, received_id, sent_id, last_raiting, new_raiting, series)
		VALUES ($1, $2, $3, $4, $5, NULL)`,
		newID, request.ReceivedId, request.SentId, lastRaiting, newRait); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE users SET raiting = $1 WHERE id = $2`, newRait, request.ReceivedId); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	saveCtx, cancelSave := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancelSave()
	if err := rr.saveStreak(saveCtx, request.ReceivedId, newID, request.Mark, series); err != nil {
		return errors.New("Redis inactive" + err.Error())
	}
	return nil
}

func calculateRating(previous float64, mark int, bonus float64, currentCount int) float64 {
	// последний рейтинг * количество голосов + новый голос + бонус за серию / (количество голосов + 1)
	previousSum := previous * float64(currentCount)
	return (previousSum + float64(mark) + bonus) / float64(currentCount+1)
}

// getStreakBonus подсчет бонус за серию голосов. Если предыдущий голос был того же типа, что и текущий, то бонус увеличивается на 1% за каждый голос в серии. Если предыдущий голос был другого типа, то бонус сбрасывается до 0.
func (rr *RaitRepository) getStreakBonus(ctx context.Context, tx *sql.Tx, userID string, newMark int) (float64, int, error) {
	data, err := rr.redis.HGetAll(ctx, rr.streakPrefix+userID).Result()
	if err != nil {
		return 0, 0, err
	}
	series := 1
	if len(data) > 0 {
		lastMark, err := strconv.Atoi(data["last_mark"])
		if err != nil {
			return 0, 0, errors.New("invalid Redis last_mark: " + err.Error())
		}
		count, err := strconv.Atoi(data["count"])
		if err != nil || count < 1 {
			return 0, 0, errors.New("invalid Redis streak count")
		}
		if lastMark == newMark {
			series = count + 1
		}
	} else {
		var saved sql.NullInt64
		err := tx.QueryRowContext(ctx, `
			SELECT series FROM raiting WHERE received_id = $1
			ORDER BY created_at DESC, id DESC LIMIT 1`, userID).Scan(&saved)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			return 0, 0, err
		}
		if saved.Valid && saved.Int64 > 0 {
			series = int(saved.Int64) + 1
		}
	}
	return float64(series) / 100, series, nil
}

const (
	streakTimeout          = 48 * time.Hour
	streakOperationTimeout = 10 * time.Second
)
