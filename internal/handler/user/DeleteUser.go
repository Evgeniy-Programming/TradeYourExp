package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DeleteUser удаляет пользователя по ID.
// @Summary      Удалить пользователя
// @Description  Удаляет пользователя из базы данных по его UUID.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "UUID пользователя"
// @Success      200  {object}  nil     "Пользователь успешно удален"
// @Failure      404  {object}  map[string]interface{} "Неверный формат ID"
// @Failure      500  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /users/{id} [delete]
func (h *Handler) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}
	if err := h.repo.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}
