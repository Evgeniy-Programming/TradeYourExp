package user

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.Storage
}

func NewUserHandler(repo repository.Storage) *Handler {
	return &Handler{repo: repo}
}
