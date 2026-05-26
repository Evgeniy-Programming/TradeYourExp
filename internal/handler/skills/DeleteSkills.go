package skills

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

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
