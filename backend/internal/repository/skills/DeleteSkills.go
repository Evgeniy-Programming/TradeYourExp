package skills

import "database/sql"

func (r *Repository) DeleteSkill(id string) error {
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
