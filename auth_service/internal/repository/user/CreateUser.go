package user

import (
	"context"
	"fmt"

	"Trade-y-exp/auth_service/internal/models"

	"github.com/google/uuid"
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
		if err.Error() == `pq: duplicate key value violates unique constraint "users_username_key"` ||
			err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"` {
			return ErrUserExists
		}
		return fmt.Errorf("insert error: %w", err)
	}
	return nil
}
