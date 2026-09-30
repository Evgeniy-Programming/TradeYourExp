package user

import (
	"context"
	"database/sql"
	"errors"
)

// GetUsernameByEmail нужен для входа по email: auth-service логинит только по username.
func (r *Repository) GetUsernameByEmail(ctx context.Context, email string) (string, error) {
	var username string
	err := r.db.QueryRowContext(ctx, `SELECT username FROM users WHERE LOWER(email) = LOWER($1)`, email).Scan(&username)
	if errors.Is(err, sql.ErrNoRows) {
		return "", ErrNotFound
	}
	return username, err
}
