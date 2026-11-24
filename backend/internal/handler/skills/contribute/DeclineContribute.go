package contribute

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ActivateContribute отклонение первичной коммуникации
// @Summary      Отклонение совместной коммуникации
// @Description  Отклонение первичного взаимодействия (pending -> active)
// @Description  и повторная активация.
// @Tags         contribute
// @Accept       json
// @Produce      json
// @Param        skill_id   path      string  true  "ID запроса"
// @Success      201  {object}  models.ResponseApi  "Первичная коммуникация завершена"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/contribute/decline/{skill_id} [patch]
func (ch *ContributeHandler) ActivateContribute(ctx *gin.Context) {
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

	if err := ch.repo.Skills.ActivateSkill(ctx, id); err != nil {
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
		Message:   "Successfull repeatedly topic",
		Result:    id,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}

// RejectedContribute одностороннее отклонение коммуникации
// @Summary      Принудительная отмена взаимодействия
// @Description  Одностороннее принудительное отклонение (freeze -> rejected)
// @Tags         contribute
// @Accept       json
// @Produce      json
// @Param        skill_id   path      string  true  "ID запроса"
// @Success      201  {object}  models.ResponseApi  "Принудительная отмена успешна"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/contribute/reject/{skill_id} [patch]
func (ch *ContributeHandler) RejectedContribute(ctx *gin.Context) {
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

	if err := ch.repo.Skills.RejectSkill(ctx, id); err != nil {
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
		Message:   "Successfull forced cancellation",
		Result:    id,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}

// ClosedContribute успешное завершение коммуникации
// @Summary      Успешное завершение взаимодействия
// @Description  Завершение взаимодействия (freeze -> closed)
// @Tags         contribute
// @Accept       json
// @Produce      json
// @Param        skill_id   path      string  true  "ID запроса"
// @Success      201  {object}  models.ResponseApi  "Успешное завершение обмена"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/contribute/close/{skill_id} [patch]
func (ch *ContributeHandler) ClosedContribute(ctx *gin.Context) {
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

	if err := ch.repo.Skills.CloseSkill(ctx, id); err != nil {
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
		Message:   "Successfull closed communication",
		Result:    id,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}
