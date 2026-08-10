package user

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.PgRepo
}

func NewUserHandler(repo repository.PgRepo) *Handler {
	return &Handler{repo: repo}
}
