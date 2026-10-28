package user

import (
	"context"
	"fmt"
	"net/http"

	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	authdb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// RefreshToken обновление токенов через auth-service.
// @Summary      Обновление токенов
// @Description  Выдает новую пару токенов по refresh-токену из cookie.
// @Tags         users
// @Produce      json
// @Success      200    {object}  models.ResponseApi "Токены успешно обновлены"
// @Failure      401    {object}  models.ResponseApi "Refresh-токен отсутствует или недействителен"
// @Router       /refresh [post]
func (h *Handler) RefreshToken(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	refreshToken, err := c.Cookie(refreshCookie)
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Refresh token is required",
		})
		return
	}

	// Проксируем запрос в auth-service через gRPC
	resp, err := h.authClient.RefreshToken(context.Background(), &authdb.RefreshRequest{
		RefreshToken: refreshToken,
	})
	if err != nil {
		if code := status.Code(err); code == codes.Unauthenticated || code == codes.NotFound {
			clearAuthCookies(c)
			c.JSON(http.StatusUnauthorized, models.ResponseApi{
				RequestID: fmt.Sprint(requestID),
				Status:    false,
				Error:     err.Error(),
				Message:   "Invalid refresh token",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Auth Service error",
		})
		return
	}

	setAuthCookies(c, resp)

	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Token successfull refreshed",
	}

	c.JSON(http.StatusOK, responseApi)
}
