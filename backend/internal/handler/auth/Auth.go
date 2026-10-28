package auth

import (
	"context"
	"net/http"
	"os"
	"time"

	"Trade-y-exp/internal/repository"
	authpb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
)

const (
	AccessCookie  = "auth_token"
	RefreshCookie = "refresh_token"

	// refresh-cookie отправляется браузером только на эндпоинты авторизации
	refreshCookiePath = "/api/v1/auth"
	// совпадает с RefreshTokenExp в auth_service/pkg/jwt
	refreshCookieMaxAge = 7 * 24 * 60 * 60

	grpcTimeout = 5 * time.Second
)

type Handler struct {
	repo         repository.Repository
	authClient   authpb.AuthServiceClient
	secureCookie bool
}

func NewAuthHandler(repo repository.Repository, authClient authpb.AuthServiceClient) *Handler {
	return &Handler{
		repo:         repo,
		authClient:   authClient,
		secureCookie: os.Getenv("COOKIE_SECURE") == "true",
	}
}

func (h *Handler) grpcContext(c *gin.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(c.Request.Context(), grpcTimeout)
}

func (h *Handler) setCookie(c *gin.Context, name, value, path string, maxAge int) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     path,
		MaxAge:   maxAge,
		HttpOnly: true,
		Secure:   h.secureCookie,
		SameSite: http.SameSiteStrictMode,
	})
}

func (h *Handler) setAuthCookies(c *gin.Context, resp *authpb.AuthResponse) {
	h.setCookie(c, AccessCookie, resp.GetAccessToken(), "/", int(resp.GetExpiresIn()))
	h.setCookie(c, RefreshCookie, resp.GetRefreshToken(), refreshCookiePath, refreshCookieMaxAge)
}

func (h *Handler) clearAuthCookies(c *gin.Context) {
	h.setCookie(c, AccessCookie, "", "/", -1)
	h.setCookie(c, RefreshCookie, "", refreshCookiePath, -1)
}
