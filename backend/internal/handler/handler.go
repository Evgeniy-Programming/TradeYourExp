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
	GetSkills(ctx *gin.Context)
	CreateSkill(ctx *gin.Context)
	CreateDescription(ctx *gin.Context)
	CreateSkillWithDesc(ctx *gin.Context)
	GetDescriptionByID(ctx *gin.Context)
	GetAllDescriptions(ctx *gin.Context)
	GetSkillByCategory(ctx *gin.Context)
	GetSkillByFilters(ctx *gin.Context)
	DeleteSkill(ctx *gin.Context)
	ContributeSkill(ctx *gin.Context)
}

type UserHandler interface {
	Login(ctx *gin.Context)
	Register(ctx *gin.Context)
	UpdateUser(ctx *gin.Context)
	DeleteUser(ctx *gin.Context)
	GetMyProfile(ctx *gin.Context)
	GetProfile(ctx *gin.Context)
	GetMyProfileStatic(c *gin.Context)
	Logout(ctx *gin.Context)
	RefreshToken(ctx *gin.Context)
	UpdateMyProfile(ctx *gin.Context)
	ChangePassword(ctx *gin.Context)
}

type RaitingHandler interface {
	ChangeRait(ctx *gin.Context)
	UpdateRait(ctx *gin.Context)
	GetMyRait(ctx *gin.Context)
	GetUserRait(ctx *gin.Context)
	GetRaitHistory(ctx *gin.Context)
}

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
