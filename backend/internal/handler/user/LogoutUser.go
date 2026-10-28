package user

import (
	"context"
	"fmt"
	"net/http"

	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	authdb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
)

// Logout выход пользователя через auth-service.
// @Summary      Выход пользователя
// @Description  Отзывает access-токен в auth-service и удаляет cookie с токенами.
// @Tags         users
// @Produce      json
// @Success      200    {object}  models.ResponseApi "Пользователь успешно вышел"
// @Failure      500    {object}  models.ResponseApi "Ошибка auth-service"
// @Router       /logout [post]
func (h *Handler) Logout(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	token, _ := c.Cookie(accessCookie)

	// cookie удаляем в любом случае, чтобы пользователь вышел
	clearAuthCookies(c)

	if token != "" {
		if _, err := h.authClient.Logout(context.Background(), &authdb.LogoutRequest{
			Token: token,
		}); err != nil {
			c.JSON(http.StatusInternalServerError, models.ResponseApi{
				RequestID: fmt.Sprint(requestID),
				Status:    false,
				Error:     err.Error(),
				Message:   "Auth Service error",
			})
			return
		}
	}

	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "User successfull logout",
	}

	c.JSON(http.StatusOK, responseApi)
}
