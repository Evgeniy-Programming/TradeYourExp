package user

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMyProfile вывод собственного профиля.
// @Summary      Вывести собственный профиль
// @Description  Вывод полного профиля.
// @Tags         users
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.ResponseApi "Вывод профиля"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /users/me [get]
func (h *Handler) GetMyProfile(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	userID, _ := c.Get(contextkeys.UserIDKey)
	user, err := h.repo.User.GetMyProfile(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
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
		Message:   "Profile successfull received",
		Result:    user,
	}

	c.JSON(http.StatusOK, responseApi)
}

// GetProfile вывод профиля стороннего пользователя.
// @Summary      Вывести сторонний профиль
// @Description  Вывод полного профиля пользователя.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        username   path      string  true  "Имя (UserName) пользователя"
// @Success      200  {object}  models.ResponseApi "Вывод профиля пользователя"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /users/profile/{username} [get]
func (h *Handler) GetProfile(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	username := c.Param("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Username is required",
		})
		return
	}
	user, err := h.repo.User.GetProfile(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
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
		Message:   "Profile successfull received",
		Result:    user,
	}

	c.JSON(http.StatusOK, responseApi)
}

// GetMyProfileStatic вывод собственной статистики.
// @Summary      Вывести собственный статистики
// @Description  Вывод полной статистики.
// @Tags         users
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.ResponseApi "Вывод статистики"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /users/me/static [get]
func (h *Handler) GetMyProfileStatic(c *gin.Context) {
	requestID, _ := c.Get(contextkeys.RequestIDKey)
	userID, _ := c.Get(contextkeys.UserIDKey)
	user, err := h.repo.User.GetMyProfileStatic(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
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
		Message:   "Statistics successfull received",
		Result:    user,
	}

	c.JSON(http.StatusOK, responseApi)
}
