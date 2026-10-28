package user

import (
	"Trade-y-exp/internal/models"
	"context"
	"database/sql"
	"errors"
)

const profileColumns = `id, username, email, first_name, last_name, social_link, created_at`

func scanProfile(row *sql.Row) (*models.Profile, error) {
	var p models.Profile
	err := row.Scan(&p.ID, &p.Username, &p.Email, &p.FirstName, &p.LastName, &p.Link, &p.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *Repository) GetProfileByID(ctx context.Context, userID string) (*models.Profile, error) {
	return scanProfile(r.db.QueryRowContext(ctx,
		`SELECT `+profileColumns+` FROM users WHERE id = $1`, userID))
}

func (r *Repository) GetProfileByUsername(ctx context.Context, username string) (*models.Profile, error) {
	return scanProfile(r.db.QueryRowContext(ctx,
		`SELECT `+profileColumns+` FROM users WHERE username = $1`, username))
}
