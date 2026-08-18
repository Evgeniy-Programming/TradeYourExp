package skills

import (
	"Trade-y-exp/internal/models"
	"context"
	"database/sql"
	"strings"
)

func (r *Repository) GetAllSkills() ([]models.Skill, error) {
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
func (r *Repository) GetSkillByCategory(ctx context.Context, category string) (*[]models.Skill, error) {
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

func (r *Repository) GetSkillByFilters(ctx context.Context, search string) (*[]models.SkillFull, error) {
	var records []models.SkillFull

	search = "%" + strings.ReplaceAll(strings.ReplaceAll(search, "%", "\\%"), "_", "\\_") + "%"

	rows, err := r.db.QueryContext(ctx, `
        SELECT 
            sd.id, sd.description, sd.media, sd.created_at,
            s.skill, s.exchange, s.username, s.category
        FROM skill_descriptions sd
        JOIN skills s ON s.id = sd.skill_id
        WHERE 
            LOWER(
                COALESCE(sd.description, '') || ' ' ||
                COALESCE(s.skill, '') || ' ' ||
                COALESCE(s.exchange, '') || ' ' ||
                COALESCE(s.username, '') || ' ' ||
				COALESCE(s.category, '')
            ) LIKE LOWER($1)
        ORDER BY sd.created_at DESC
    `, search)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var record models.SkillFull
		if err := rows.Scan(
			&record.ID,
			&record.Description,
			&record.Media,
			&record.CreatedAt,
			&record.Skill,
			&record.Exchange,
			&record.Username,
			&record.Category,
		); err != nil {
			return nil, err
		}
		records = append(records, record)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &records, nil
}

func (r *Repository) GetDescriptionBySkillID(ctx context.Context, skillID int) (*models.SkillDescription, error) {
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

func (r *Repository) GetAllDescriptions(ctx context.Context) ([]models.SkillDescription, error) {
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
