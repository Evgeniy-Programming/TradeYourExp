package user

import (
	"context"
	"errors"
	"fmt"

	"Trade-y-exp/auth_service/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
)

func (r *UserRepository) CreateUser(ctx context.Context, u *models.User) error {
	// Генерируем UUID, если не задан
	if u.ID == "" {
		u.ID = uuid.New().String()
	}

	_, err := r.db.ExecContext(ctx,
		`INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)`,
		u.ID, u.Username, u.Email, u.Password, u.Role,
	)
	if err != nil {
		// Проверка на unique constraint (username/email)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return ErrUserExists
		}
		return fmt.Errorf("insert error: %w", err)
	}
	return nil
}
