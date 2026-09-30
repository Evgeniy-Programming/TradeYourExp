package user

import (
	authpb "Trade-y-exp/auth_service/proto/auth"
	"context"
)

func (a *UserHandler) ValidateToken(ctx context.Context, req *authpb.ValidateRequest) (*authpb.ValidateResponse, error) {
	if a.isRevoked(req.Token) {
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
