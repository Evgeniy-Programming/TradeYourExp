package user

import (
	"Trade-y-exp/auth_service/internal/models"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

func (r *UserRepository) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, username, email, password, role FROM users WHERE username = $1`,
		username,
	)

	var u models.User
	err := row.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	return &u, nil
}

func (r *UserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, username, email, password, role FROM users WHERE id = $1`,
		id,
	)

	var u models.User
	err := row.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	return &u, nil
}
