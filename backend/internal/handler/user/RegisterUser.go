package user

import (
	"Trade-y-exp/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register создает нового пользователя.
// @Summary      Создание пользователя
// @Description  Создание пользователя с заполнение требуемых полей.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Пользователь корректен"
// @Success      204  {object}  nil     "Пользователь успешно создан"
// @Failure      400  {object}  map[string]interface{} "Неверный формат данных"
// @Failure      404  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /register [post]
func (h *Handler) Register(c *gin.Context) {
	var u models.User
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	if err := h.repo.User.CreateUser(&u); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}
