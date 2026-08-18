package user

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.Repository
}

func NewUserHandler(repo repository.Repository) *Handler {
	return &Handler{repo: repo}
}
