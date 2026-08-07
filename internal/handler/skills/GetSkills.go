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

// GetSkillByCategory вывод списка скиллов по категории.
// @Summary      Вывести все скиллы по категории.
// @Description  Вывод полного списка скиллов по категории.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        category   path      string  true  "Категория скилла"
// @Success      204  {object}  nil     "Вывод пользовательских скиллов"
// @Failure      400  {object}  map[string]interface{} "Неверный формат"
// @Failure      404  {object}  map[string]interface{} "Категория не найдена"
// @Router       /skills/{category} [get]
func (h *Handler) GetSkillByCategory(c *gin.Context) {
	category := c.Param("category")
	if category == "" {
		skills, err := h.repo.FetchSkills()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}
		c.JSON(http.StatusOK, skills)
		return
	}

	skill, err := h.repo.GetSkillByCategory(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	if skill == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}

	c.JSON(http.StatusOK, skill)
}
