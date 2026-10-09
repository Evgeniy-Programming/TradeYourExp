package handler

import (
	"context"
	"errors"
	"net/http"
	"time"

	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/handler/auth"
	"Trade-y-exp/internal/handler/respond"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	authpb "Trade-y-exp/proto/auth"
)

type Config struct {
	JWTSecret string
}

// AuthMiddleware проверяет access-токен из HttpOnly cookie и кладёт данные пользователя в контекст.
func AuthMiddleware(cfg Config, authClient authpb.AuthServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie(auth.AccessCookie)
		if err != nil || cookie == "" {
			respond.Error(c, http.StatusUnauthorized, "Требуется авторизация", nil)
			return
		}

		// FAST PATH: локальная валидация JWT (без сети)
		if cfg.JWTSecret != "" {
			token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("unexpected signing method")
				}
				return []byte(cfg.JWTSecret), nil
			})
			if err == nil && token.Valid {
				if claims, ok := token.Claims.(jwt.MapClaims); ok {
					if userID, _ := claims["user_id"].(string); userID != "" {
						username, _ := claims["username"].(string)
						role, _ := claims["role"].(string)
						setUser(c, userID, username, role)
						c.Next()
						return
					}
				}
			}
		}

		// SLOW PATH: валидация через gRPC (проверка blacklist и т.д.)
		ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
		defer cancel()
		resp, err := authClient.ValidateToken(ctx, &authpb.ValidateRequest{Token: cookie})
		if err != nil || !resp.GetIsValid() {
			respond.Error(c, http.StatusUnauthorized, "Сессия истекла, войдите снова", err)
			return
		}
		setUser(c, resp.GetUserId(), resp.GetUsername(), resp.GetRole())
		c.Next()
	}
}

func setUser(c *gin.Context, userID, username, role string) {
	c.Set(contextkeys.UserIDKey, userID)
	c.Set(contextkeys.UsernameKey, username)
	c.Set(contextkeys.RoleKey, role)
}

func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role := contextkeys.String(c, contextkeys.RoleKey)
		for _, allowed := range allowedRoles {
			if role == allowed {
				c.Next()
				return
			}
		}
		respond.Error(c, http.StatusForbidden, "Недостаточно прав", nil)
	}
}

// gen requestID
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}
		c.Set(contextkeys.RequestIDKey, requestID)

		// для трейсинга
		c.Header("X-Request-ID", requestID)

		c.Next()
	}
}
