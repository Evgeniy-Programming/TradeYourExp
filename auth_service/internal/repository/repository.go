package repository

import (
	"Trade-y-exp/auth_service/internal/models"
	"Trade-y-exp/auth_service/internal/repository/user"
	"context"
	"database/sql"
)

type UserRepository interface {
	CreateUser(ctx context.Context, u *models.User) error
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	GetUserByID(ctx context.Context, id string) (*models.User, error)
}

type Repository struct {
	User user.UserRepository
	DB   *sql.DB
}

func NewRepository(DB *sql.DB) *Repository {
	return &Repository{
		User: *user.NewUserRepository(DB),
	}
}
