package skills

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) CreateDescription(c *gin.Context) {
	var req struct {
		SkillID     int    `json:"skill_id"`
		Description string `json:"description"`
		Media       string `json:"media"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if req.SkillID <= 0 || req.Description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "skill_id and description are required"})
		return
	}

	if err := h.repo.UpsertDescription(c.Request.Context(), req.SkillID, req.Description, req.Media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}
