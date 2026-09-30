package skills

import (
	"Trade-y-exp/internal/models"
	"Trade-y-exp/pkg/repo"
	"context"
	"errors"
	"fmt"
)

var ErrInvalidCategory = errors.New("category is invalid")

// CreateSkill создаёт обмен вместе с описанием в одной транзакции.
func (r *Repository) CreateSkill(ctx context.Context, username string, req *models.SkillCreateRequest) (int, error) {
	if !repo.IsValidCategory(req.Category) {
		return 0, ErrInvalidCategory
	}

	contactType := req.ContactType
	if contactType == "" {
		contactType = "site"
	}
	contactValue := req.ContactValue
	if contactType == "site" {
		contactValue = nil
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	var id int
	err = tx.QueryRowContext(ctx,
		`INSERT INTO skills (username, skill, exchange, category, contact_type, contact_value)
		 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
		username, req.Skill, req.Exchange, req.Category, contactType, contactValue).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("insert skill: %w", err)
	}

	if req.Description != "" {
		if _, err := tx.ExecContext(ctx,
			`INSERT INTO skill_descriptions (skill_id, description) VALUES ($1, $2)`,
			id, req.Description); err != nil {
			return 0, fmt.Errorf("insert description: %w", err)
		}
	}

	return id, tx.Commit()
}

func (r *Repository) UpsertDescription(ctx context.Context, skillID int, description, media string) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO skill_descriptions (skill_id, description, media) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (skill_id) 
         DO UPDATE SET description = $2, media = $3, created_at = NOW()`,
		skillID, description, media)
	return err
}
