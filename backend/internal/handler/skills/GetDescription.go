package skills

import (
	"Trade-y-exp/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetDescriptionByID вывод доп. описания по Skill ID.
// @Summary      Вывод описания по skill_id
// @Description  Выводит описание по персональному skill_id
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Вывод описания по skill_id"
// @Success      200  {object}  nil     "Вывод пользователя"
// @Failure      400  {object}  map[string]interface{} "Неверный формат Skill ID"
// @Failure      404  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /skills/desc/{id} [get]
func (h *Handler) GetDescriptionByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid skill id"})
		return
	}

	desc, err := h.repo.GetDescriptionBySkillID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	if desc == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "description not found"})
		return
	}

	c.JSON(http.StatusOK, desc)
}

// GetAllDescriptions вывод списка всех доп. описаний.
// @Summary      Вывести все доп.описания
// @Description  Вывод полного дополнительных описаний
// @Tags         skills
// @Accept       json
// @Produce      json
// @Success      200  {object}  nil     "Вывод списка доп. описаний"
// @Failure      400  {object}  map[string]interface{} "Неверный формат"
// @Failure      404  {object}  map[string]interface{} "Пользователь не найден"
// @Router       /skills/desc [get]
func (h *Handler) GetAllDescriptions(c *gin.Context) {
	descs, err := h.repo.GetAllDescriptions(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	// пустой массив вместо null, чтобы JS на фронте не падал при переборе
	if descs == nil {
		descs = []models.SkillDescription{}
	}

	c.JSON(http.StatusOK, descs)
}
