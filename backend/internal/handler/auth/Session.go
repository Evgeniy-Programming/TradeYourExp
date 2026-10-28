package auth

import (
	"log"
	"net/http"

	"Trade-y-exp/internal/handler/respond"
	authpb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
)

// Refresh выдаёт новую пару токенов по refresh-cookie.
// @Summary      Обновление токенов
// @Tags         auth
// @Produce      json
// @Success      200  {object}  models.ResponseApi
// @Failure      401  {object}  models.ResponseApi
// @Router       /auth/refresh [post]
func (h *Handler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie(RefreshCookie)
	if err != nil || refreshToken == "" {
		respond.Error(c, http.StatusUnauthorized, "Сессия истекла, войдите снова", nil)
		return
	}

	ctx, cancel := h.grpcContext(c)
	defer cancel()

	resp, err := h.authClient.RefreshToken(ctx, &authpb.RefreshRequest{RefreshToken: refreshToken})
	if err != nil {
		h.clearAuthCookies(c)
		respond.Error(c, http.StatusUnauthorized, "Сессия истекла, войдите снова", err)
		return
	}

	h.setAuthCookies(c, resp)
	respond.OK(c, http.StatusOK, "Токены обновлены", gin.H{"expiresIn": resp.GetExpiresIn()})
}

// Logout отзывает access-токен в auth-service и удаляет cookie.
// @Summary      Выход
// @Tags         auth
// @Produce      json
// @Success      200  {object}  models.ResponseApi
// @Router       /auth/logout [post]
func (h *Handler) Logout(c *gin.Context) {
	if token, err := c.Cookie(AccessCookie); err == nil && token != "" {
		ctx, cancel := h.grpcContext(c)
		defer cancel()
		if _, err := h.authClient.Logout(ctx, &authpb.LogoutRequest{Token: token}); err != nil {
			// cookie всё равно удаляем, чтобы пользователь вышел
			log.Printf("logout: revoke token: %v", err)
		}
	}

	h.clearAuthCookies(c)
	respond.OK(c, http.StatusOK, "Выход выполнен", nil)
}
