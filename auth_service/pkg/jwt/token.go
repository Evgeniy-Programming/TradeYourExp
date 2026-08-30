package jwt

import (
	"errors"
	"os"
	"time"

	"Trade-y-exp/auth_service/internal/repository"

	"github.com/golang-jwt/jwt/v5"
)

const (
	AccessTokenExp  = 15 * time.Minute
	RefreshTokenExp = 7 * 24 * time.Hour
)

type Manager struct {
	AccessSecret  []byte
	RefreshSecret []byte
}
type TokenClaims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func NewManager() *Manager {
	accessSecret := os.Getenv("JWT_ACCESS_SECRET")
	refreshSecret := os.Getenv("JWT_REFRESH_SECRET")

	if accessSecret == "" || refreshSecret == "" {
		panic("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set")
	}

	return &Manager{
		AccessSecret:  []byte(accessSecret),
		RefreshSecret: []byte(refreshSecret),
	}
}

func (m *Manager) NewAccessToken(user *repository.User) (string, error) {
	claims := TokenClaims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(AccessTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(m.AccessSecret)
}

func (m *Manager) NewRefreshToken(user *repository.User) (string, error) {
	claims := TokenClaims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(RefreshTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(m.RefreshSecret)
}

func (m *Manager) ParseAccessToken(tokenStr string) (*TokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return m.AccessSecret, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}
