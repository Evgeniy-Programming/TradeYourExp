package raiting

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetRaitHistory вывод истории изменения собственного рейтинга.
// @Summary      Вывести историю выставлению рейтинга пользователя
// @Description  Вывод рейтинговой шкалы.
// @Tags         raiting
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.ResponseApi "Вывод рейтинга"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /rait/history/me [get]
func (h *Handler) GetRaitHistory(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	userID, _ := ctx.Get(contextkeys.UserIDKey)
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Id is required",
		})
		return
	}
	rait, err := h.repo.Raiting.GetRaitHistory(userID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Failed to fetch",
		})
		return
	}

	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Raiting history successfull recived",
		Result:    rait,
	}

	ctx.JSON(http.StatusOK, responseApi)
}

// GetInflurenceRait влияние пользователя sentId на рейтинг receivedId.
// @Summary      Вывести влияние пользователя в системе рейтинга
// @Description  Вывод рейтинговой шкалы.
// @Tags         raiting
// @Accept       json
// @Produce      json
// @Param        received_id   path      string  true  "На кого пришлось влияние"
// @Param        sent_id   query      string  true  "Инициатор влияния"
// @Success      200  {object}  models.ResponseApi "Вывод рейтинга"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /rait/history/{received_id} [get]
func (h *Handler) GetInfluenceRait(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	receivedId := ctx.Param("received_id")
	sentId := ctx.Query("sent_id")
	if receivedId == "" || sentId == "" {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Id (received or sent) is required",
		})
		return
	}
	rait, err := h.repo.Raiting.GetInfluenceRait(receivedId, sentId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Failed to fetch",
		})
		return
	}

	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "History of influence successfull recived",
		Result:    rait,
	}

	ctx.JSON(http.StatusOK, responseApi)
}
