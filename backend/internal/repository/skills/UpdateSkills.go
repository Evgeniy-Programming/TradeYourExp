package skills

import (
	"context"
	"errors"
	"fmt"
)

func (sr *SkillRepository) ContributeSkill(ctx context.Context, skillId string, userId string) error {
	if skillId == "" {
		return errors.New("skillId is not found")
	}

	tx, err := sr.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("transaction invalid: %w", err)
	}
	defer tx.Rollback()
	query := `UPDATE skills SET status = 'freeze', contributor = $2 WHERE id = $1;`
	_, err = tx.ExecContext(ctx, query, skillId, userId)
	if err != nil {
		return fmt.Errorf("transaction error: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("transaction commit error: %w", err)
	}

	return nil
}
