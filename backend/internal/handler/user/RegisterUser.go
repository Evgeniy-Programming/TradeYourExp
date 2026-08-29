package user

import (
	"context"
	"net/http"

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
// @Param        input  body      nil  true  "Данные пользователя"
// @Success      201    {object}  map[string]interface{} "Пользователь успешно создан"
// @Failure      400    {object}  map[string]interface{} "Неверный формат данных"
// @Failure      409    {object}  map[string]interface{} "Пользователь уже существует"
// @Router       /register [post]
func (h *Handler) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role" binding:"required,oneof=manager admin viewer"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid data"})
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
			c.JSON(http.StatusConflict, gin.H{"error": "user exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "registration failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "ok", "user_id": resp.UserId})
}
