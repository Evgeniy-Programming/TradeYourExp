package skills

import (
	"Trade-y-exp/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AddSkill(c *gin.Context) {
	var s models.Skill
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	// Исправлено: передаём контекст и игнорируем возвращаемый ID (он не нужен для простого добавления)
	_, err := h.repo.SaveSkill(c.Request.Context(), &s)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}
