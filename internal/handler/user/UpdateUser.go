package user

import (
	"Trade-y-exp/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UpdateUser обновляет данные пользователя по ID(UUID).
// @Summary      Обновить данные
// @Description  Обновляет данные в базе данных по его UUID.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "ID пользователя"
// @Param input body models.User true "Новые данные"
// @Success      201  {object}  nil     "Пользователь успешно обновлен"
// @Failure      400  {object}  map[string]interface{} "Неверный формат ID"
// @Failure      404  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /users/{id} [put]
func (h *Handler) UpdateUser(c *gin.Context) {
	var u models.User
	id := c.Param("id")
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	if err := h.repo.UpdateUser(&u, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error" + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "profile succesfull update"})
}
