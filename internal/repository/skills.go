package repository

import (
	"Trade-y-exp/internal/models"
	"database/sql"
)

func (r *PgRepo) SaveSkill(s *models.Skill) error {
	q := `INSERT INTO skills (username, skill, exchange) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(q, s.Username, s.Skill, s.Exchange)
	return err
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
	rows, err := r.db.Query("SELECT id, username, skill, exchange FROM skills ORDER BY id DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []models.Skill
	for rows.Next() {
		var s models.Skill
		if err := rows.Scan(&s.ID, &s.Username, &s.Skill, &s.Exchange); err == nil {
			res = append(res, s)
		}
	}
	return res, nil
}
