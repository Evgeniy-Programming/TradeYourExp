package skills

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.Storage
}

func NewSkillHandler(repo repository.Storage) *Handler {
	return &Handler{repo: repo}
}
