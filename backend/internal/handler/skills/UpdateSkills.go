package skills

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ContributeSkill cоздание коммуникации
// @Summary      Создание коммуникации
// @Description  Создает пару id + contribute user_id
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        skill_id   path      string  true  "ID навыка"
// @Success      201  {object}  models.ResponseApi  "Синхронизация успешна"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/{skill_id} [patch]
func (h *Handler) ContributeSkill(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	userId, _ := ctx.Get(contextkeys.UserIDKey)
	skillId := ctx.Param("skill_id")
	if skillId == "" {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Skill undefined",
		})
		return
	}
	if err := h.repo.Skills.ContributeSkill(ctx, skillId, userId.(string)); err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "DataBase Error",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Successfull contribute",
		Result:    skillId,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}
