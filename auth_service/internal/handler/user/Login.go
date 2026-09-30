package user

import (
	userrepo "Trade-y-exp/auth_service/internal/repository/user"
	authpb "Trade-y-exp/auth_service/proto/auth"
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *UserHandler) Login(ctx context.Context, req *authpb.LoginRequest) (*authpb.AuthResponse, error) {
	user, err := a.repo.User.GetUserByUsername(ctx, req.Username)
	if err != nil {
		if errors.Is(err, userrepo.ErrUserNotFound) {
			return nil, status.Error(codes.Unauthenticated, "invalid credentials")
		}
		return nil, status.Error(codes.Internal, "database error")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid credentials")
	}

	return a.generateTokens(user)
}
