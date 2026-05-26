package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DeleteUser авторизация пользователя в сервисе.
// @Summary      Авторизация пользовтеля
// @Description  Авторизирует пользователя по введенным данным.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Пользователь авторизирован"
// @Success      204  {object}  nil     "Пользователь успешно вошел"
// @Failure      400  {object}  map[string]interface{} "Неверный формат данных"
// @Failure      404  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /api/v1/login [post]
func (h *Handler) Login(c *gin.Context) {
	var inp struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&inp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid data"})
		return
	}

	u, err := h.repo.GetByEmail(inp.Email)
	if err != nil || u.Password != inp.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "wrong creds"})
		return
	}
	c.JSON(http.StatusOK, u)
}
