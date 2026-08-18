package skills

import (
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) CreateSkill(c *gin.Context) {
	var s models.Skill
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	// Исправлено: передаём контекст и игнорируем возвращаемый ID (он не нужен для простого добавления)
	_, err := h.repo.Skills.SaveSkill(c.Request.Context(), &s)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}

// @Summary Добавление запроса с дополнительным описанием
// @Description Создание нового запроса с описанием
// @Tags skills
// @Security ApiKeyAuth
// @Accept       json
// @Produce      json
// @Param input body models.Skill true "Данные запроса навыка"
// @Success 201 {object} nil "Запрос навыка успешно создан"
// @Failure 400 {object} map[string]interface{} "Неверный формат запроса"
// @Failure 409 {object} map[string]interface{} "Конфликт при создании запроса"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /skills [post]
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
	skillID, err := h.repo.Skills.SaveSkill(c.Request.Context(), skill)
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
			if err := h.repo.Skills.UpsertDescription(c.Request.Context(), skillID, fullDesc, media); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
				return
			}
		}
	}

	c.JSON(http.StatusCreated, gin.H{"status": "ok", "skill_id": skillID})
}
