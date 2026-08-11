package skills

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// GetSkills вывод списка скиллов всех пользователей.
// @Summary      Вывести все скиллы
// @Description  Вывод полного списка навыков.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Success      200  {object}  nil     "Вывод пользовательских скиллов"
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
// @Success      200  {object}  nil     "Вывод пользовательских скиллов"
// @Failure      400  {object}  map[string]interface{} "Неверный формат"
// @Failure      404  {object}  map[string]interface{} "Категория не найдена"
// @Router       /skills/{category} [get]
func (h *Handler) GetSkillByCategory(c *gin.Context) {
	category := c.Param("category")
	if strings.TrimSpace(category) == "" {
		skills, err := h.repo.FetchSkills()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}
		c.JSON(http.StatusOK, skills)
		return
	}

	skills, err := h.repo.GetSkillByCategory(c.Request.Context(), strings.TrimSpace(category))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	if skills == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}

	c.JSON(http.StatusOK, skills)
}

// GetSkillByFilters вывод списка скиллов по ключевой строке.
// @Summary      Вывести все скиллы по вхождению в ключевую строку.
// @Description  Вывод полного списка скиллов по переданной строке.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        search   path      string  true  "Ключевая строка поиска"
// @Success      200  {object}  nil     "Вывод пользовательских скиллов"
// @Failure      400  {object}  map[string]interface{} "Неверный формат"
// @Failure      404  {object}  map[string]interface{} "Категория не найдена"
// @Router       /skills/filter/{search} [get]
func (h *Handler) GetSkillByFilters(c *gin.Context) {
	search := c.Param("search")

	if strings.TrimSpace(search) == "" {
		// Если строка пустая — возвращаем все записи
		skills, err := h.repo.FetchSkills()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}
		c.JSON(http.StatusOK, skills)
		return
	}

	skills, err := h.repo.GetSkillByFilters(c.Request.Context(), strings.TrimSpace(search))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	if skills == nil || len(*skills) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "parametres for search is not found"})
		return
	}

	c.JSON(http.StatusOK, skills)
}
