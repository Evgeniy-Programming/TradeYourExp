package skills

import (
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *Handler) CreateSkill(c *gin.Context) {
	var s models.Skill
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Bad request",
		})
		return
	}

	// Исправлено: передаём контекст и игнорируем возвращаемый ID (он не нужен для простого добавления)
	id, err := h.repo.Skills.SaveSkill(c.Request.Context(), &s)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Failed DataBase",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Skill succesfull created",
		Result:    strconv.Itoa(id),
	}
	c.JSON(http.StatusCreated, responseApi)
}

// @Summary Добавление запроса с дополнительным описанием
// @Description Создание нового запроса с описанием
// @Tags skills
// @Accept       json
// @Produce      json
// @Param input body models.SkillFull true "Данные запроса навыка"
// @Success 201 {object} models.ResponseApi "Запрос навыка успешно создан"
// @Failure 400 {object} models.ResponseApi "Неверный формат запроса"
// @Failure 409 {object} models.ResponseApi "Конфликт при создании запроса"
// @Failure 500 {object} models.ResponseApi "Внутренняя ошибка сервера"
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
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Validation failed",
		})
		return
	}

	if req.Username == "" || req.Skill == "" || req.Exchange == "" {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Message: "Username, skill and exchange are required",
		})
		return
	}
	skill := &models.Skill{
		Username: req.Username,
		Skill:    req.Skill,
		Exchange: req.Exchange,
	}
	skillID, err := h.repo.Skills.SaveSkill(c.Request.Context(), skill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Failed DataBase",
		})
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
				c.JSON(http.StatusInternalServerError, models.ResponseApi{
					Status:  false,
					Error:   err.Error(),
					Message: "Failed to save description",
				})
				return
			}
		}
	}

	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Skill successfull added",
		Result:    strconv.Itoa(skillID),
	}
	c.JSON(http.StatusCreated, responseApi)
}
