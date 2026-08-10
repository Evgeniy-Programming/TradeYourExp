package skills

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DeleteSkill удаляет запрос навыка по ID
// @Summary      Удалить запрос
// @Description  Удаляет запрос навыка по его ID
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "ID запроса"
// @Success      200  {object}  nil     "Запрос навыка успешно удален"
// @Failure      404  {object}  map[string]interface{} "Неверный формат ID"
// @Failure      500  {object}  map[string]interface{} "Запрос не найден"
// @Router       /skills/{id} [delete]
func (h *Handler) DeleteSkill(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}
	if err := h.repo.DeleteSkill(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}
