package user

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"Trade-y-exp/internal/repository/user"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UpdateMyProfile обновляет собственный профиль.
// @Summary      Обновить собственный профиль
// @Description  Обновляет только переданные непустые поля профиля.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param input body models.UpdateProfileRequest true "Новые данные профиля"
// @Success      200  {object}  models.ResponseApi "Профиль успешно обновлен"
// @Failure      400  {object}  models.ResponseApi "Неверный формат данных"
// @Failure      409  {object}  models.ResponseApi "Username уже занят"
// @Router       /users/me [put]
func (h *Handler) UpdateMyProfile(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	userID, _ := c.Get(contextkeys.UserIDKey)
	var req models.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Invalid data",
		})
		return
	}

	if err := h.repo.User.UpdateProfile(&req, fmt.Sprint(userID)); err != nil {
		if errors.Is(err, user.ErrUsernameTaken) {
			c.JSON(http.StatusConflict, models.ResponseApi{
				RequestID: fmt.Sprint(requestID),
				Status:    false,
				Error:     err.Error(),
				Message:   "Username exists",
			})
			return
		}
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
		Message:   "Profile successfull updated",
	}

	c.JSON(http.StatusOK, responseApi)
}
