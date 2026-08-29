package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
)

var (
	ErrUserNotFound = errors.New("user not found")
	ErrUserExists   = errors.New("user already exists")
)

type User struct {
	ID       string
	Username string
	Email    string
	Password string // bcrypt hash
	Role     string
}

type UserRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) GetByUsername(ctx context.Context, username string) (*User, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, username, email, password, role FROM users WHERE username = $1`,
		username,
	)

	var u User
	err := row.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role)
	if err == sql.ErrNoRows {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	return &u, nil
}

func (r *UserRepo) GetByID(ctx context.Context, id string) (*User, error) {
	row := r.db.QueryRowContext(ctx,
		`SELECT id, username, email, password, role FROM users WHERE id = $1`,
		id,
	)

	var u User
	err := row.Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.Role)
	if err == sql.ErrNoRows {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	return &u, nil
}

func (r *UserRepo) Create(ctx context.Context, u *User) error {
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
