package skills

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetSkills вывод списка скиллов всех пользователей.
// @Summary      Вывести все скиллы
// @Description  Вывод полного списка навыков.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Success      204  {object}  nil     "Вывод пользовательских скиллов"
// @Failure      400  {object}  map[string]interface{} "Неверный формат"
// @Failure      404  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /skills [get]
func (h *Handler) GetSkills(c *gin.Context) {
	list, err := h.repo.FetchSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
		return
	}
	c.JSON(http.StatusOK, list)
}
