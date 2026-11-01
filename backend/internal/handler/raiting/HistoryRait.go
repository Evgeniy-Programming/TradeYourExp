package raiting

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetRaitHistory вывод истории изменения рейтинга.
// @Summary      Вывести историю выставлению рейтинга пользователя
// @Description  Вывод рейтинговой шкалы.
// @Tags         raiting
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Id пользователя"
// @Success      200  {object}  models.ResponseApi "Вывод рейтинга"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /rait/history/{id} [get]
func (h *Handler) GetRaitHistory(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Id is required",
		})
		return
	}
	rait, err := h.repo.Raiting.GetRaitHistory(id)
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
