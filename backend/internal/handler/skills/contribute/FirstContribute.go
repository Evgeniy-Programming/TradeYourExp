package contribute

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// FirstContribute cоздание коммуникации
// @Summary      Создание коммуникации
// @Description  Создает пару id + contribute user_id
// @Tags         contribute
// @Accept       json
// @Produce      json
// @Param input body models.SkillContribute true "Данные для запроса коммуникации"
// @Success      201  {object}  models.ResponseApi  "Синхронизация успешна"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/contribute/{skill_id} [patch]
func (ch *ContributeHandler) ContributeSkill(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	userId, _ := ctx.Get(contextkeys.UserIDKey)
	var req struct {
		SkillId  string `json:"skill_id" binding:"required"`
		Addition string `json:"addition" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Bad request",
		})
		return
	}

	contribute := models.SkillContribute{
		SkillID:  req.SkillId,
		ID:       userId.(string),
		Addition: req.Addition,
	}

	if err := ch.repo.Skills.ContributeSkill(ctx, contribute); err != nil {
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
		Result:    contribute,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}
