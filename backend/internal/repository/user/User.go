package user

import (
	"database/sql"
	"errors"

	_ "github.com/lib/pq"
)

var (
	ErrNotFound   = errors.New("user not found")
	ErrUserExists = errors.New("username or email already taken")
)

type Repository struct {
	db *sql.DB
}

func NewUserRepository(DB *sql.DB) *Repository {
	if DB == nil {
		return nil
	}
	return &Repository{db: DB}
}
