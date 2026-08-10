package skills

import (
	"Trade-y-exp/internal/repository"
)

type Handler struct {
	repo repository.PgRepo
}

func NewSkillHandler(repo repository.PgRepo) *Handler {
	return &Handler{repo: repo}
}
