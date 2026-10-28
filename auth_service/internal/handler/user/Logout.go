package user

import (
	"Trade-y-exp/auth_service/pkg/jwt"
	authpb "Trade-y-exp/auth_service/proto/auth"
	"context"
	"time"
)

func (a *UserHandler) Logout(ctx context.Context, req *authpb.LogoutRequest) (*authpb.LogoutResponse, error) {
	a.revoke(req.Token, time.Now().Add(jwt.AccessTokenExp))
	return &authpb.LogoutResponse{Success: true}, nil
}
