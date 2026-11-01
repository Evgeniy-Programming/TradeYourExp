package skills

import "database/sql"

func (sr *SkillRepository) DeleteSkill(id string) error {
	q := `DELETE FROM skills WHERE id=$1`
	result, err := sr.db.Exec(q, id)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
