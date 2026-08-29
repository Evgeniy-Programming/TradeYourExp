package handler

import (
	"Trade-y-exp/internal/handler/skills"
	"Trade-y-exp/internal/handler/user"
	"Trade-y-exp/internal/repository"
	authpb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
)

type SkillsHandler interface {
	GetSkills(c *gin.Context)
	CreateSkill(c *gin.Context)
	CreateDescription(c *gin.Context)
	CreateSkillWithDesc(c *gin.Context)
	GetDescriptionByID(c *gin.Context)
	GetAllDescriptions(c *gin.Context)
	GetSkillByCategory(c *gin.Context)
	GetSkillByFilters(c *gin.Context)
	DeleteSkill(c *gin.Context)
}

type UserHandler interface {
	Login(c *gin.Context)
	Register(c *gin.Context)
	UpdateUser(c *gin.Context)
	DeleteUser(c *gin.Context)
}

type Handler struct {
	User   *user.Handler
	Skills *skills.Handler
}

func NewHMainHandler(s repository.Repository, authClient authpb.AuthServiceClient) *Handler {
	return &Handler{
		User:   user.NewUserHandler(s, authClient),
		Skills: skills.NewSkillHandler(s),
	}
}
