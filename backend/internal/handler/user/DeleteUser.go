package user

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// DeleteUser удаляет пользователя по ID.
// @Summary      Удалить пользователя
// @Description  Удаляет пользователя из базы данных по его UUID.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "UUID пользователя"
// @Success      201  {object}  models.ResponseApi "Пользователь успешно удален"
// @Failure      404  {object}  models.ResponseApi "Неверный формат ID"
// @Failure      500  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /users/{id} [delete]
func (h *Handler) DeleteUser(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Message: "Id is required",
		})
		return
	}
	if err := h.repo.User.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "User successfull deleted",
		Result:    id,
	}
	c.JSON(http.StatusCreated, responseApi)
}
