package skills

import (
	"Trade-y-exp/internal/models"
	"context"
	"errors"
	"fmt"
)

func (sr *SkillRepository) ContributeSkill(ctx context.Context, request models.SkillContribute) error {
	if request.SkillID == "" {
		return errors.New("skillId is not found")
	}

	tx, err := sr.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("transaction invalid: %w", err)
	}
	defer tx.Rollback()
	query := `UPDATE skills SET status = 'pending', contributor = $2, addition = $3 WHERE id = $1;`
	_, err = tx.ExecContext(ctx, query, request.SkillID, request.ID, request.Addition)
	if err != nil {
		return fmt.Errorf("transaction error: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("transaction commit error: %w", err)
	}

	return nil
}
