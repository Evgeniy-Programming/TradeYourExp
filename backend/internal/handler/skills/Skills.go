package skills

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.Repository
}

func NewSkillHandler(repo repository.Repository) *Handler {
	return &Handler{repo: repo}
}
