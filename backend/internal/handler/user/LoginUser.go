package user

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"Trade-y-exp/internal/contextkeys"
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
// @Param input body models.LoginRequest true "Данные для входа (в username можно передать email)"
// @Success      200    {object}  models.ResponseApi "Пользователь успешно вошел"
// @Failure      400    {object}  models.ResponseApi "Неверный формат данных"
// @Failure      401    {object}  models.ResponseApi "Неверные учетные данные"
// @Router       /login [post]
func (h *Handler) Login(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Invalid data for login",
		})
		return
	}

	// auth-service логинит только по username — для email сначала находим username
	username := req.Username
	if strings.Contains(username, "@") {
		name, err := h.repo.User.GetUsernameByEmail(username)
		if err != nil {
			c.JSON(http.StatusUnauthorized, models.ResponseApi{
				RequestID: fmt.Sprint(requestID),
				Status:    false,
				Error:     err.Error(),
				Message:   "Invalid creds",
			})
			return
		}
		username = name
	}

	// Проксируем запрос в auth-service через gRPC
	resp, err := h.authClient.Login(context.Background(), &authdb.LoginRequest{
		Username: username,
		Password: req.Password,
	})
	if err != nil {
		if status.Code(err) == codes.Unauthenticated {
			c.JSON(http.StatusUnauthorized, models.ResponseApi{
				RequestID: fmt.Sprint(requestID),
				Status:    false,
				Error:     err.Error(),
				Message:   "Invalid creds",
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

	// Устанавливаем HttpOnly cookie с JWT-токенами
	setAuthCookies(c, resp)

	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
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
