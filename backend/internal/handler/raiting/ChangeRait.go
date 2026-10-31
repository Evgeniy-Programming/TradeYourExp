package raiting

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ChangeRait выставить свой рейтинг пользователю
// @Summary      Выставить свой рейтинг
// @Description  Выставляет рейтинг относительно новых данных
// @Tags         raiting
// @Accept       json
// @Produce      json
// @Param input body models.RaitRequest true "Данные для выставления рейтинга"
// @Success      201  {object}  models.ResponseApi  "Рейтинг успешно поставлен"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /rait/{id} [post]
func (h *Handler) ChangeRait(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	sentId, _ := ctx.Get(contextkeys.UserIDKey)
	var req struct {
		ReceivedId string `json:"received_id" binding:"required"`
		Mark       int    `json:"mark" binding:"required"`
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
	request := models.LogicRaitRequest{
		ReceivedId: req.ReceivedId,
		SentId:     sentId.(string),
		Mark:       req.Mark,
	}

	err := h.repo.Raiting.ChangeRait(ctx.Request.Context(), request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Failed DataBase",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Raiting successfull update",
		Result:    req.ReceivedId,
	}
	ctx.JSON(http.StatusCreated, responseApi)
}
