package skills

import (
	"Trade-y-exp/internal/models"
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
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Invalid request body",
		})
		return
	}

	if req.SkillID <= 0 || req.Description == "" {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Message: "Skill_id and description is required",
		})
		return
	}

	if err := h.repo.Skills.UpsertDescription(c.Request.Context(), req.SkillID, req.Description, req.Media); err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}

	responseApi := models.ResponseApi{
		RequestID: "",
		Status:    true,
		Message:   "Description create successfull",
		Result:    req.Description,
	}

	c.JSON(http.StatusCreated, responseApi)
}
