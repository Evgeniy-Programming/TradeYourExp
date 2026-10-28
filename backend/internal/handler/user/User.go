package user

import (
	"Trade-y-exp/internal/repository"
)

// Handler — административные операции над пользователями.
type Handler struct {
	repo repository.Repository
}

func NewUserHandler(repo repository.Repository) *Handler {
	return &Handler{repo: repo}
}
