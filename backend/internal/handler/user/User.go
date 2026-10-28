package user

import (
	"Trade-y-exp/internal/repository"
	authpb "Trade-y-exp/proto/auth"
)

type Handler struct {
	repo       repository.Repository
	authClient authpb.AuthServiceClient
}

func NewUserHandler(repo repository.Repository, authClient authpb.AuthServiceClient) *Handler {
	return &Handler{repo: repo, authClient: authClient}
}
