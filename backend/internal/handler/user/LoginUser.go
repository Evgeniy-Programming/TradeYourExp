package user

import (
	"context"
	"net/http"

	authdb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Login авторизация пользователя через auth-service.
// @Summary      Авторизация пользователя
// @Description  Авторизирует пользователя по введенным данным.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        input  body      LoginRequest  true  "Данные для входа"
// @Success      200    {object}  map[string]interface{} "Пользователь успешно вошел"
// @Failure      400    {object}  map[string]interface{} "Неверный формат данных"
// @Failure      401    {object}  map[string]interface{} "Неверные учетные данные"
// @Router       /login [post]
func (h *Handler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid data"})
		return
	}

	// Проксируем запрос в auth-service через gRPC
	resp, err := h.authClient.Login(context.Background(), &authdb.LoginRequest{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		if status.Code(err) == codes.Unauthenticated {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "wrong creds"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "auth service error"})
		return
	}

	// Устанавливаем HttpOnly cookie с JWT-токеном
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    resp.AccessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // "true" для HTTPS в продакшене
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(resp.ExpiresIn),
	})

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
