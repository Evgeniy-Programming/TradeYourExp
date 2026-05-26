package handler

import (
	"Trade-y-exp/internal/handler/skills"
	"Trade-y-exp/internal/handler/user"
	"Trade-y-exp/internal/repository"

	"github.com/gin-gonic/gin"
)

type SkillsHandler interface {
	GetSkills(c *gin.Context)
	AddSkill(c *gin.Context)
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

func NewHMainHandler(s repository.Storage) *Handler {
	return &Handler{
		User:   user.NewUserHandler(s),
		Skills: skills.NewSkillHandler(s),
	}
}
