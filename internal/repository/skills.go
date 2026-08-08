package repository

import (
	"Trade-y-exp/internal/models"
	"context"
	"database/sql"
)

// SaveSkill — создаёт навык и возвращает его ID
func (r *PgRepo) SaveSkill(ctx context.Context, s *models.Skill) (int, error) {
	var id int
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO skills (username, skill, exchange, category) VALUES ($1, $2, $3, $4) RETURNING id`,
		s.Username, s.Skill, s.Exchange, s.Category).Scan(&id)
	return id, err
}

func (r *PgRepo) DeleteSkill(id string) error {
	q := `DELETE FROM skills WHERE id=$1`
	result, err := r.db.Exec(q, id)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *PgRepo) FetchSkills() ([]models.Skill, error) {
	rows, err := r.db.Query("SELECT id, username, skill, exchange, category FROM skills ORDER BY id DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []models.Skill
	for rows.Next() {
		var s models.Skill
		if err := rows.Scan(&s.ID, &s.Username, &s.Skill, &s.Exchange, &s.Category); err == nil {
			res = append(res, s)
		}
	}
	return res, nil
}

func (r *PgRepo) GetSkillByCategory(ctx context.Context, category string) (*[]models.Skill, error) {
	var skills []models.Skill
	rows, err := r.db.QueryContext(ctx, `
        SELECT 
            id, username, skill, exchange, category
        FROM skills
        WHERE category = $1
		ORDER BY id DESC
	`, category)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var skill models.Skill
		if err := rows.Scan(&skill.ID, &skill.Username, &skill.Skill, &skill.Exchange, &skill.Category); err != nil {
			return nil, err
		}
		skills = append(skills, skill)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return &skills, rows.Err()
}

func (r *PgRepo) GetDescriptionBySkillID(ctx context.Context, skillID int) (*models.SkillDescription, error) {
	var desc models.SkillDescription
	err := r.db.QueryRowContext(ctx, `
        SELECT 
            sd.id, sd.skill_id, sd.description, sd.media, sd.created_at,
            s.skill, s.exchange, s.username
        FROM skill_descriptions sd
        JOIN skills s ON s.id = sd.skill_id
        WHERE sd.skill_id = $1
    `, skillID).Scan(
		&desc.ID, &desc.SkillID, &desc.Description, &desc.Media, &desc.CreatedAt,
		&desc.Skill, &desc.Exchange, &desc.Username,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &desc, err
}

func (r *PgRepo) GetAllDescriptions(ctx context.Context) ([]models.SkillDescription, error) {
	rows, err := r.db.QueryContext(ctx, `
        SELECT sd.id, sd.skill_id, sd.description, sd.media, sd.created_at,
               s.skill, s.exchange, s.username
        FROM skill_descriptions sd
        JOIN skills s ON s.id = sd.skill_id
        ORDER BY sd.created_at DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var descs []models.SkillDescription
	for rows.Next() {
		var d models.SkillDescription
		if err := rows.Scan(&d.ID, &d.SkillID, &d.Description, &d.Media, &d.CreatedAt,
			&d.Skill, &d.Exchange, &d.Username); err != nil {
			return nil, err
		}
		descs = append(descs, d)
	}
	return descs, rows.Err()
}

func (r *PgRepo) UpsertDescription(ctx context.Context, skillID int, description, media string) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO skill_descriptions (skill_id, description, media) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (skill_id) 
         DO UPDATE SET description = $2, media = $3, created_at = NOW()`,
		skillID, description, media)
	return err
}
