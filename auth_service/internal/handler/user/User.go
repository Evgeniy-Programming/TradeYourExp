package user

import (
	"Trade-y-exp/auth_service/internal/models"
	"Trade-y-exp/auth_service/internal/repository"
	"Trade-y-exp/auth_service/pkg/jwt"
	authpb "Trade-y-exp/auth_service/proto/auth"
	"sync"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type UserHandler struct {
	authpb.UnimplementedAuthServiceServer
	repo      *repository.Repository
	jwtMgr    *jwt.Manager
	mu        sync.RWMutex
	blacklist map[string]time.Time
}

func NewUserHandler(repo *repository.Repository, jwtMgr *jwt.Manager) *UserHandler {
	return &UserHandler{
		repo:      repo,
		jwtMgr:    jwtMgr,
		blacklist: make(map[string]time.Time),
	}
}

func (a *UserHandler) revoke(token string, until time.Time) {
	a.mu.Lock()
	defer a.mu.Unlock()

	now := time.Now()
	for t, exp := range a.blacklist {
		if now.After(exp) {
			delete(a.blacklist, t)
		}
	}
	a.blacklist[token] = until
}

func (a *UserHandler) isRevoked(token string) bool {
	a.mu.RLock()
	defer a.mu.RUnlock()
	_, ok := a.blacklist[token]
	return ok
}

func (a *UserHandler) generateTokens(user *models.User) (*authpb.AuthResponse, error) {
	access, err := a.jwtMgr.NewAccessToken(*user)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to generate access token")
	}

	refresh, err := a.jwtMgr.NewRefreshToken(*user)
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
