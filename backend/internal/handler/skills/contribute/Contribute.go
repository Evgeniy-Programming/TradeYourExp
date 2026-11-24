package contribute

import (
	"Trade-y-exp/internal/repository"
)

type ContributeHandler struct {
	repo repository.Repository
}

func NewContributeHandler(repo repository.Repository) *ContributeHandler {
	return &ContributeHandler{repo: repo}
}
