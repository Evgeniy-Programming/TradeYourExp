package user

import (
	"context"
	"database/sql"
	"errors"
)

func (r *Repository) GetPasswordHash(ctx context.Context, userID string) (string, error) {
	var hash string
	err := r.db.QueryRowContext(ctx, `SELECT password FROM users WHERE id = $1`, userID).Scan(&hash)
	if errors.Is(err, sql.ErrNoRows) {
		return "", ErrNotFound
	}
	return hash, err
}

func (r *Repository) UpdatePasswordHash(ctx context.Context, userID, hash string) error {
	res, err := r.db.ExecContext(ctx, `UPDATE users SET password = $1 WHERE id = $2`, hash, userID)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return ErrNotFound
	}
	return nil
}
