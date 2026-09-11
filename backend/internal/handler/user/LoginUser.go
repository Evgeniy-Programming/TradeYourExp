package user

import (
	"context"
	"net/http"

	"Trade-y-exp/internal/models"
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
// @Param input body models.LoginRequest true "Данные для входа"
// @Success      200    {object}  models.ResponseApi "Пользователь успешно вошел"
// @Failure      400    {object}  models.ResponseApi "Неверный формат данных"
// @Failure      401    {object}  models.ResponseApi "Неверные учетные данные"
// @Router       /login [post]
func (h *Handler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Invalid data for login",
		})
		return
	}

	// Проксируем запрос в auth-service через gRPC
	resp, err := h.authClient.Login(context.Background(), &authdb.LoginRequest{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		if status.Code(err) == codes.Unauthenticated {
			c.JSON(http.StatusUnauthorized, models.ResponseApi{
				Status:  false,
				Error:   err.Error(),
				Message: "Invalid creds",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Auth Service error",
		})
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

	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "User successfull login",
		Result: models.AuthResponse{
			Username:  resp.Username,
			Email:     resp.Email,
			FirstName: resp.Role,
		},
	}

	c.JSON(http.StatusOK, responseApi)
}
