package user

import (
	"database/sql"

	"github.com/google/uuid"
)

func (r *Repository) GetPasswordHash(id string) (string, error) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return "", err
	}
	var hash string
	q := `SELECT password FROM users WHERE id=$1`
	err = r.db.QueryRow(q, parsedID).Scan(&hash)
	return hash, err
}

func (r *Repository) UpdatePassword(hash, id string) error {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	q := `UPDATE users SET password=$1 WHERE id=$2`
	result, err := r.db.Exec(q, hash, parsedID)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
