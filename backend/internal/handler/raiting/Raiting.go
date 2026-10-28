package raiting

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.Repository
}

func NewRaitingHandler(repo repository.Repository) *Handler {
	return &Handler{repo: repo}
}
