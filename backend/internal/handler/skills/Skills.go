package skills

import (
	"Trade-y-exp/internal/handler/skills/contribute"
	"Trade-y-exp/internal/repository"

	"github.com/gin-gonic/gin"
)

type ContributeHandler interface {
	ContributeSkill(ctx *gin.Context)
	ApproveContribute(ctx *gin.Context)
	ActivateContribute(ctx *gin.Context)
	RejectedContribute(ctx *gin.Context)
	ClosedContribute(ctx *gin.Context)
}
type Handler struct {
	repo repository.Repository
	ContributeHandler
}

func NewSkillHandler(repo repository.Repository) *Handler {
	return &Handler{
		repo:              repo,
		ContributeHandler: contribute.NewContributeHandler(repo),
	}
}
