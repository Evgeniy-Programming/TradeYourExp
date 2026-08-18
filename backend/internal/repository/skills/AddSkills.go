package skills

import (
	"Trade-y-exp/internal/models"
	"context"
)

func (r *Repository) SaveSkill(ctx context.Context, s *models.Skill) (int, error) {
	var id int
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO skills (username, skill, exchange, category) VALUES ($1, $2, $3, $4) RETURNING id`,
		s.Username, s.Skill, s.Exchange, s.Category).Scan(&id)
	return id, err
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
