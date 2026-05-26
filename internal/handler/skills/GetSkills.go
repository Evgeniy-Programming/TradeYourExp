package skills

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetSkills(c *gin.Context) {
	list, err := h.repo.FetchSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
		return
	}
	c.JSON(http.StatusOK, list)
}
