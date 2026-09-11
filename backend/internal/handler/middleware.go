package handler

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	authpb "Trade-y-exp/proto/auth"
)

const (
	ContextUserID   = "user_id"
	ContextUsername = "username"
	ContextRole     = "role"
)

type Config struct {
	AuthServiceAddr string
	JWTSecret       string
	PublicPaths     []string
}

// AuthMiddleware возвращает Gin-совместимый middleware
func AuthMiddleware(cfg Config) gin.HandlerFunc {
	// gRPC клиент (создаём один раз)
	conn, err := grpc.NewClient(cfg.AuthServiceAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	authClient := authpb.NewAuthServiceClient(conn)

	return func(c *gin.Context) {
		// Пропускаем публичные маршруты
		for _, path := range cfg.PublicPaths {
			if c.Request.URL.Path == path {
				c.Next()
				return
			}
		}

		// токен из HttpOnly Cookie
		cookie, err := c.Cookie("auth_token")
		if err != nil || cookie == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: missing token"})
			c.Abort()
			return
		}

		// FAST PATH: локальная валидация JWT (без сети)
		token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err == nil && token.Valid {
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				// Inject user data into Gin context
				c.Set(ContextUserID, claims["user_id"])
				c.Set(ContextUsername, claims["username"])
				c.Set(ContextRole, claims["role"])
				c.Next()
				return
			}
		}

		// SLOW PATH: валидация через gRPC (проверка blacklist и т.д.)
		resp, err := authClient.ValidateToken(context.Background(), &authpb.ValidateRequest{
			Token: cookie,
		})
		if err != nil || !resp.GetIsValid() {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: invalid token"})
			c.Abort()
			return
		}
		c.Set(ContextUserID, resp.GetUserId())
		c.Set(ContextUsername, resp.GetUsername())
		c.Set(ContextRole, resp.GetRole())
		c.Next()
	}
}

// RequireRole — middleware для проверки роли
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(ContextRole)
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: role not found"})
			c.Abort()
			return
		}

		roleStr, ok := role.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: invalid role type"})
			c.Abort()
			return
		}

		for _, allowed := range allowedRoles {
			if roleStr == allowed {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient permissions"})
		c.Abort()
	}
}
