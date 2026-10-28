package user

import (
	"net/http"

	authdb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
)

const (
	accessCookie  = "auth_token"
	refreshCookie = "refresh_token"
	// совпадает с RefreshTokenExp в auth_service/pkg/jwt
	refreshTokenMaxAge = 7 * 24 * 60 * 60
	// роль новых пользователей
	defaultRole = "manager"
)

// setAuthCookies ставит HttpOnly cookie с access- и refresh-токеном
func setAuthCookies(c *gin.Context, resp *authdb.AuthResponse) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     accessCookie,
		Value:    resp.AccessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // "true" для HTTPS в продакшене
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(resp.ExpiresIn),
	})
	// refresh-токен нужен только ручкам /refresh и /logout
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     refreshCookie,
		Value:    resp.RefreshToken,
		Path:     "/api/v1",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   refreshTokenMaxAge,
	})
}

// clearAuthCookies удаляет cookie с токенами
func clearAuthCookies(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{Name: accessCookie, Path: "/", MaxAge: -1, HttpOnly: true})
	http.SetCookie(c.Writer, &http.Cookie{Name: refreshCookie, Path: "/api/v1", MaxAge: -1, HttpOnly: true})
}
