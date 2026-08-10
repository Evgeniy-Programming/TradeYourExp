package skills

import (
	"Trade-y-exp/internal/models"
	"fmt"
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

func (h *Handler) CreateSkillWithDesc(c *gin.Context) {
	var req struct {
		Username     string `json:"username"`
		Skill        string `json:"skill"`
		Exchange     string `json:"exchange"`
		Description  string `json:"description"`
		Media        string `json:"media"`
		ContactType  string `json:"contact_type"`
		ContactValue string `json:"contact_value"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if req.Username == "" || req.Skill == "" || req.Exchange == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username, skill and exchange are required"})
		return
	}
	skill := &models.Skill{
		Username: req.Username,
		Skill:    req.Skill,
		Exchange: req.Exchange,
	}
	skillID, err := h.repo.SaveSkill(c.Request.Context(), skill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	// если есть доп. поля — создаём описание
	if req.Description != "" || (req.ContactType != "site" && req.ContactValue != "") {
		fullDesc := req.Description
		media := ""
		if req.ContactType != "site" && req.ContactValue != "" {
			media = fmt.Sprintf("Тип связи: %s, Имя: %s", req.ContactType, req.ContactValue)
		}
		if fullDesc != "" || media != "" {
			if err := h.repo.UpsertDescription(c.Request.Context(), skillID, fullDesc, media); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
				return
			}
		}
	}

	c.JSON(http.StatusCreated, gin.H{"status": "ok", "skill_id": skillID})
}
