package user

import (
	"Trade-y-exp/auth_service/internal/models"
	authpb "Trade-y-exp/auth_service/proto/auth"
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *UserHandler) Register(ctx context.Context, req *authpb.RegisterRequest) (*authpb.AuthResponse, error) {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to hash password")
	}

	user := &models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPwd),
		Role:     req.Role,
	}

	if err := a.repo.User.CreateUser(ctx, user); err != nil {
		if errors.Is(err, ErrUserExists) {
			return nil, status.Error(codes.AlreadyExists, "user already exists")
		}
		return nil, status.Error(codes.Internal, "failed to create user")
	}

	return a.generateTokens(user)
}
