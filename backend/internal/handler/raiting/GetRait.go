package raiting

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMyRait вывод собственного рейтинга.
// @Summary      Вывести собственный рейтинг
// @Description  Вывод рейтинговой шкалы.
// @Tags         raiting
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.ResponseApi "Вывод рейтинга"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /rait/me [get]
func (h *Handler) GetMyRait(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	userID, _ := ctx.Get(contextkeys.UserIDKey)
	rait, err := h.repo.Raiting.GetMyRait(userID.(string))
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
		Message:   "Raiting successfull recived",
		Result:    rait,
	}

	ctx.JSON(http.StatusOK, responseApi)
}
