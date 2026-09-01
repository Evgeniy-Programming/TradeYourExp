package handler

import (
	"context"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"Trade-y-exp/auth_service/internal/repository"
	"Trade-y-exp/auth_service/pkg/jwt"
	authpb "Trade-y-exp/auth_service/proto/auth"
)

type Auth struct {
	authpb.UnimplementedAuthServiceServer
	repo      *repository.UserRepo
	jwtMgr    *jwt.Manager
	blacklist map[string]time.Time
}

func NewAuth(repo *repository.UserRepo, jwtMgr *jwt.Manager) *Auth {
	return &Auth{
		repo:      repo,
		jwtMgr:    jwtMgr,
		blacklist: make(map[string]time.Time),
	}
}

func (a *Auth) Register(ctx context.Context, req *authpb.RegisterRequest) (*authpb.AuthResponse, error) {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to hash password")
	}

	user := &repository.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPwd),
		Role:     req.Role,
	}

	if err := a.repo.Create(ctx, user); err != nil {
		if errors.Is(err, repository.ErrUserExists) {
			return nil, status.Error(codes.AlreadyExists, "user already exists")
		}
		return nil, status.Error(codes.Internal, "failed to create user")
	}

	return a.generateTokens(user)
}

func (a *Auth) Login(ctx context.Context, req *authpb.LoginRequest) (*authpb.AuthResponse, error) {
	user, err := a.repo.GetByUsername(ctx, req.Username)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return nil, status.Error(codes.Unauthenticated, "invalid credentials")
		}
		return nil, status.Error(codes.Internal, "database error")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid credentials")
	}

	return a.generateTokens(user)
}

func (a *Auth) ValidateToken(ctx context.Context, req *authpb.ValidateRequest) (*authpb.ValidateResponse, error) {
	if _, banned := a.blacklist[req.Token]; banned {
		return &authpb.ValidateResponse{IsValid: false}, nil
	}

	claims, err := a.jwtMgr.ParseAccessToken(req.Token)
	if err != nil {
		return &authpb.ValidateResponse{IsValid: false}, nil
	}

	return &authpb.ValidateResponse{
		IsValid:   true,
		UserId:    claims.UserID,
		Username:  claims.Username,
		Role:      claims.Role,
		ExpiresAt: claims.ExpiresAt.Unix(),
	}, nil
}

func (a *Auth) RefreshToken(ctx context.Context, req *authpb.RefreshRequest) (*authpb.AuthResponse, error) {
	claims, err := a.jwtMgr.ParseAccessToken(req.RefreshToken)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid refresh token")
	}

	user, err := a.repo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, status.Error(codes.NotFound, "user not found")
	}

	return a.generateTokens(user)
}

func (a *Auth) Logout(ctx context.Context, req *authpb.LogoutRequest) (*authpb.LogoutResponse, error) {
	a.blacklist[req.Token] = time.Now().Add(jwt.AccessTokenExp)
	return &authpb.LogoutResponse{Success: true}, nil
}

func (a *Auth) generateTokens(user *repository.User) (*authpb.AuthResponse, error) {
	access, err := a.jwtMgr.NewAccessToken(user)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to generate access token")
	}

	refresh, err := a.jwtMgr.NewRefreshToken(user)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to generate refresh token")
	}

	return &authpb.AuthResponse{
		UserId:       user.ID,
		Username:     user.Username,
		Email:        user.Email,
		Role:         user.Role,
		AccessToken:  access,
		RefreshToken: refresh,
		ExpiresIn:    int64(jwt.AccessTokenExp.Seconds()),
	}, nil
}
