package user

import (
	"database/sql"

	"github.com/google/uuid"
)

func (r *Repository) DeleteUser(id string) error {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	q := `DELETE FROM users WHERE id=$1`
	res, err := r.db.Exec(q, parsedID)
	if err != nil {
		return err
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		return sql.ErrNoRows
	}
	return nil
}
