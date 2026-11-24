package contribute

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApproveContribute одобрение взаимодействия
// @Summary      Начало совместной коммуникации
// @Description  Утверждает контакт user A с user B
// @Tags         contribute
// @Accept       json
// @Produce      json
// @Param        skill_id   path      string  true  "ID запроса"
// @Success      201  {object}  models.ResponseApi  "Синхронизация успешна"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/contribute/approve/{skill_id} [patch]
func (ch *ContributeHandler) ApproveContribute(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	id := ctx.Param("skill_id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Skill is required",
		})
		return
	}

	if err := ch.repo.Skills.FreezeSkill(ctx, id); err != nil {
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
		Message:   "Successfull approve contribute",
		Result:    id,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}
