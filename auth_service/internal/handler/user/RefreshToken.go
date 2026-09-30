package user

import (
	authpb "Trade-y-exp/auth_service/proto/auth"
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (a *UserHandler) RefreshToken(ctx context.Context, req *authpb.RefreshRequest) (*authpb.AuthResponse, error) {
	claims, err := a.jwtMgr.ParseRefreshToken(req.RefreshToken)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid refresh token")
	}

	user, err := a.repo.User.GetUserByID(ctx, claims.UserID)
	if err != nil {
		return nil, status.Error(codes.NotFound, "user not found")
	}

	return a.generateTokens(user)
}
