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

// Register создает нового пользователя через auth-service.
// @Summary      Создание пользователя
// @Description  Создание пользователя с заполнением требуемых полей.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        input  body      models.RegisterRequest  true  "Данные пользователя"
// @Success      201    {object}  models.ResponseApi "Пользователь успешно создан"
// @Failure      400    {object}  models.ResponseApi "Неверный формат данных"
// @Failure      409    {object}  models.ResponseApi "Пользователь уже существует"
// @Router       /register [post]
func (h *Handler) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role" binding:"required,oneof=manager admin viewer"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Invalid data",
		})
		return
	}

	// Проксируем запрос в auth-service через gRPC
	resp, err := h.authClient.Register(context.Background(), &authdb.RegisterRequest{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password, // auth-service сам захеширует через bcrypt
		Role:     req.Role,
	})
	if err != nil {
		if status.Code(err) == codes.AlreadyExists {
			c.JSON(http.StatusConflict, models.ResponseApi{
				Status:  false,
				Error:   err.Error(),
				Message: "User exists",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Registraiton failed",
		})
		return
	}

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

	c.JSON(http.StatusCreated, responseApi)
}
