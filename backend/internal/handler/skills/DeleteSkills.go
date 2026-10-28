package skills

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// DeleteSkill удаляет запрос навыка по ID
// @Summary      Удалить запрос
// @Description  Удаляет запрос навыка по его ID
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "ID запроса"
// @Success      201  {object}  models.ResponseApi  "Запрос навыка успешно удален"
// @Failure      404  {object}  models.ResponseApi  "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi  "Запрос не найден"
// @Router       /skills/{id} [delete]
func (h *Handler) DeleteSkill(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Skill is required",
		})
		return
	}
	if err := h.repo.Skills.DeleteSkill(id); err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
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
		Message:   "Skill successfull deleted",
		Result:    id,
	}
	c.JSON(http.StatusCreated, responseApi)
}
