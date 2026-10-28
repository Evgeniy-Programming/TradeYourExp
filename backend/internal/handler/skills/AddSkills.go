package skills

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"Trade-y-exp/internal/handler/respond"
	"Trade-y-exp/internal/models"
	skillsrepo "Trade-y-exp/internal/repository/skills"

	"github.com/gin-gonic/gin"
)

// CreateSkill создание обмена от имени текущего пользователя.
// @Summary      Создать обмен
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        input  body      models.SkillCreateRequest  true  "Данные обмена"
// @Success      201    {object}  models.ResponseApi
// @Failure      400    {object}  models.ResponseApi
// @Router       /skills [post]
func (h *Handler) CreateSkill(c *gin.Context) {
	var req models.SkillCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respond.Error(c, http.StatusBadRequest, "Заполните навык, что хотите получить взамен, и категорию", err)
		return
	}
	req.Skill = strings.TrimSpace(req.Skill)
	req.Exchange = strings.TrimSpace(req.Exchange)
	if req.Skill == "" || req.Exchange == "" {
		respond.Error(c, http.StatusBadRequest, "Заполните навык и что хотите получить взамен", nil)
		return
	}
	if req.ContactValue != nil {
		v := strings.TrimSpace(*req.ContactValue)
		req.ContactValue = &v
	}
	if req.ContactType != "" && req.ContactType != "site" && (req.ContactValue == nil || *req.ContactValue == "") {
		respond.Error(c, http.StatusBadRequest, "Укажите никнейм для выбранного способа связи", nil)
		return
	}

	username, err := h.currentUsername(c)
	if err != nil {
		respond.Error(c, http.StatusUnauthorized, "Пользователь не найден", err)
		return
	}

	id, err := h.repo.Skills.CreateSkill(c.Request.Context(), username, &req)
	if errors.Is(err, skillsrepo.ErrInvalidCategory) {
		respond.Error(c, http.StatusBadRequest, "Неизвестная категория", nil)
		return
	}
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось опубликовать обмен", err)
		return
	}
	respond.OK(c, http.StatusCreated, "Обмен опубликован", strconv.Itoa(id))
}
