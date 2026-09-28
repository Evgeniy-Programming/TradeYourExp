package handler

import (
	"Trade-y-exp/auth_service/internal/handler/user"
	"Trade-y-exp/auth_service/internal/repository"
	"Trade-y-exp/auth_service/pkg/jwt"
	authpb "Trade-y-exp/auth_service/proto/auth"
	"context"
)

type UserHandler interface {
	Login(ctx context.Context, req *authpb.LoginRequest) (*authpb.AuthResponse, error)
	Register(ctx context.Context, req *authpb.RegisterRequest) (*authpb.AuthResponse, error)
	Logout(ctx context.Context, req *authpb.LogoutRequest) (*authpb.LogoutResponse, error)
	RefreshToken(ctx context.Context, req *authpb.RefreshRequest) (*authpb.AuthResponse, error)
	ValidateToken(ctx context.Context, req *authpb.ValidateRequest) (*authpb.ValidateResponse, error)
}

type Handler struct {
	User   *user.UserHandler
	repo   *repository.Repository
	jwtMgr *jwt.Manager
}

func NewMainHandler(s repository.Repository, jwtMgr *jwt.Manager) *Handler {
	return &Handler{
		User:   user.NewUserHandler(&s, jwtMgr),
		repo:   &s,
		jwtMgr: jwtMgr,
	}
}
