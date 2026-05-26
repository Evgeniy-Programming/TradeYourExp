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
	if err := h.repo.SaveSkill(&s); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}
