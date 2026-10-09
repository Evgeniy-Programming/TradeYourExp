package handler

import (
	"Trade-y-exp/internal/handler/auth"
	"Trade-y-exp/internal/handler/skills"
	"Trade-y-exp/internal/handler/user"
	"Trade-y-exp/internal/repository"
	authpb "Trade-y-exp/proto/auth"
)

type Handler struct {
	Auth   *auth.Handler
	User   *user.Handler
	Skills *skills.Handler
}

func NewHMainHandler(s repository.Repository, authClient authpb.AuthServiceClient) *Handler {
	return &Handler{
		Auth:   auth.NewAuthHandler(s, authClient),
		User:   user.NewUserHandler(s),
		Skills: skills.NewSkillHandler(s),
	}
}
