package handler

import (
	"Trade-y-exp/internal/handler/raiting"
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
	GetMyProfile(c *gin.Context)
	GetProfile(c *gin.Context)
	GetMyProfileStatic(c *gin.Context)
	Logout(c *gin.Context)
	RefreshToken(c *gin.Context)
	UpdateMyProfile(c *gin.Context)
	ChangePassword(c *gin.Context)
}

type RaitingHandler interface{}

type Handler struct {
	User    *user.Handler
	Skills  *skills.Handler
	Raiting *raiting.Handler
}

func NewHMainHandler(s repository.Repository, authClient authpb.AuthServiceClient) *Handler {
	return &Handler{
		User:    user.NewUserHandler(s, authClient),
		Skills:  skills.NewSkillHandler(s),
		Raiting: raiting.NewRaitingHandler(s),
	}
}
