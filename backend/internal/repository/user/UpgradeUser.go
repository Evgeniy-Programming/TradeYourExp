package user

import (
	"Trade-y-exp/internal/models"
	"database/sql"

	"github.com/google/uuid"
)

func (r *Repository) UpdateUser(u *models.User, id string) error {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	q := `UPDATE users SET username=$1, email=$2, password=$3 WHERE id=$4`
	result, err := r.db.Exec(q, u.Username, u.Email, u.Password, parsedID)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
