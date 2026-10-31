package raiting

import (
	"Trade-y-exp/internal/models"
	"context"

	"github.com/google/uuid"
)

func (rr *RaitRepository) ChangeRait(ctx context.Context, request models.LogicRaitRequest) error {
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
	newRait := lastRaiting + float32(request.Mark) // ДОРАБОТКА РАСЧЕТА
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
