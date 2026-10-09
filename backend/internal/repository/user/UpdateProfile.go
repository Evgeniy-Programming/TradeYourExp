package user

import (
	"Trade-y-exp/internal/models"
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/lib/pq"
)

// SetProfileDetails заполняет необязательные поля профиля после регистрации в auth-service.
func (r *Repository) SetProfileDetails(ctx context.Context, userID, firstName, lastName, link string) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE users SET first_name = NULLIF($1, ''), last_name = NULLIF($2, ''), social_link = NULLIF($3, '') WHERE id = $4`,
		firstName, lastName, link, userID)
	return err
}

// UpdateProfile частично обновляет профиль. При смене username переносит на него обмены пользователя.
func (r *Repository) UpdateProfile(ctx context.Context, userID string, u *models.ProfileUpdate) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var oldUsername string
	err = tx.QueryRowContext(ctx, `SELECT username FROM users WHERE id = $1 FOR UPDATE`, userID).Scan(&oldUsername)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, `
		UPDATE users SET
			username    = COALESCE($1, username),
			email       = COALESCE($2, email),
			first_name  = COALESCE($3, first_name),
			last_name   = COALESCE($4, last_name),
			social_link = COALESCE($5, social_link)
		WHERE id = $6`,
		u.Username, u.Email, u.FirstName, u.LastName, u.Link, userID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return ErrUserExists
		}
		return fmt.Errorf("update profile: %w", err)
	}

	if u.Username != nil && *u.Username != oldUsername {
		if _, err := tx.ExecContext(ctx, `UPDATE skills SET username = $1 WHERE username = $2`, *u.Username, oldUsername); err != nil {
			return fmt.Errorf("update skills owner: %w", err)
		}
	}

	return tx.Commit()
}
