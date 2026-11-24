package skills

import (
	"Trade-y-exp/internal/models"
	"context"
	"errors"
	"fmt"
	"strconv"
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

var ErrSkillTransition = errors.New(
	"skill not found or status transition is not allowed",
)

// changeStatus меняет статус и при необходимости очищает contributor
func (sr *SkillRepository) changeStatus(
	ctx context.Context,
	skillID int,
	fromStatus string,
	toStatus string,
	clearContributor bool,
) error {
	if skillID == 0 {
		return errors.New("skillId is empty")
	}

	const query = `
		UPDATE skills
		SET status = $2,
		    contributor = CASE
		        WHEN $4 THEN NULL
		        ELSE contributor
		    END
		WHERE id = $1 AND status = $3;
	`

	result, err := sr.db.ExecContext(
		ctx,
		query,
		skillID,
		toStatus,
		fromStatus,
		clearContributor,
	)
	if err != nil {
		return fmt.Errorf("change skill status: %w", err)
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("get affected rows: %w", err)
	}

	if affected == 0 {
		return ErrSkillTransition
	}

	return nil
}

// pending -> freeze, contributor сохраняется.
func (sr *SkillRepository) FreezeSkill(ctx context.Context, skillID string) error {
	skillId, _ := strconv.Atoi(skillID)
	return sr.changeStatus(ctx, skillId, "pending", "freeze", false)
}

// pending -> active, contributor очищается.
func (sr *SkillRepository) ActivateSkill(ctx context.Context, skillID string) error {
	skillId, _ := strconv.Atoi(skillID)
	return sr.changeStatus(ctx, skillId, "pending", "active", true)
}

// freeze -> rejected, contributor очищается.
func (sr *SkillRepository) RejectSkill(ctx context.Context, skillID string) error {
	skillId, _ := strconv.Atoi(skillID)
	return sr.changeStatus(ctx, skillId, "freeze", "rejected", true)
}

// freeze -> closed, contributor сохраняется.
func (sr *SkillRepository) CloseSkill(ctx context.Context, skillID string) error {
	skillId, _ := strconv.Atoi(skillID)
	return sr.changeStatus(ctx, skillId, "freeze", "closed", false)
}
