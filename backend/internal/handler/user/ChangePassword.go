package user

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// ChangePassword смена собственного пароля.
// @Summary      Сменить пароль
// @Description  Проверяет текущий пароль и сохраняет новый.
// @Tags         users
// @Accept       json
// @Produce      json
// @Param input body models.ChangePasswordRequest true "Текущий и новый пароль"
// @Success      200  {object}  models.ResponseApi "Пароль успешно изменен"
// @Failure      400  {object}  models.ResponseApi "Неверный формат данных или текущий пароль"
// @Router       /users/me/password [put]
func (h *Handler) ChangePassword(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	userID, _ := ctx.Get(contextkeys.UserIDKey)
	var req models.ChangePasswordRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Invalid data",
		})
		return
	}

	hash, err := h.repo.User.GetPasswordHash(fmt.Sprint(userID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "DataBase Error",
		})
		return
	}

	// 400, а не 401: на 401 фронтенд пытается обновить токены
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.CurrentPassword)); err != nil {
		ctx.JSON(http.StatusBadRequest, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Invalid current password",
		})
		return
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "Failed to hash password",
		})
		return
	}

	if err := h.repo.User.UpdatePassword(string(newHash), fmt.Sprint(userID)); err != nil {
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
		Message:   "Password successfull changed",
	}

	ctx.JSON(http.StatusOK, responseApi)
}
