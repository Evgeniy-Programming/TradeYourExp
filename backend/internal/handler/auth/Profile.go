package auth

import (
	"errors"
	"net/http"
	"strings"

	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/handler/respond"
	"Trade-y-exp/internal/models"
	"Trade-y-exp/internal/repository/user"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Me возвращает профиль текущего пользователя.
// @Summary      Мой профиль
// @Tags         auth
// @Produce      json
// @Success      200  {object}  models.ResponseApi{result=models.Profile}
// @Failure      401  {object}  models.ResponseApi
// @Router       /auth/me [get]
func (h *Handler) Me(c *gin.Context) {
	profile, err := h.repo.User.GetProfileByID(c.Request.Context(), contextkeys.String(c, contextkeys.UserIDKey))
	if errors.Is(err, user.ErrNotFound) {
		respond.Error(c, http.StatusUnauthorized, "Пользователь не найден", nil)
		return
	}
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось получить профиль", err)
		return
	}
	respond.OK(c, http.StatusOK, "Профиль получен", profile)
}

// Update частично обновляет профиль текущего пользователя.
// @Summary      Редактирование профиля
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input  body      models.ProfileUpdate  true  "Изменяемые поля"
// @Success      200    {object}  models.ResponseApi{result=models.Profile}
// @Failure      400    {object}  models.ResponseApi
// @Failure      409    {object}  models.ResponseApi
// @Router       /auth/update [put]
func (h *Handler) Update(c *gin.Context) {
	var req models.ProfileUpdate
	if err := c.ShouldBindJSON(&req); err != nil {
		respond.Error(c, http.StatusBadRequest, "Некорректные данные профиля", err)
		return
	}
	for _, field := range []*string{req.Username, req.Email} {
		if field != nil {
			*field = strings.TrimSpace(*field)
			if *field == "" {
				respond.Error(c, http.StatusBadRequest, "Никнейм и email не могут быть пустыми", nil)
				return
			}
		}
	}

	userID := contextkeys.String(c, contextkeys.UserIDKey)
	err := h.repo.User.UpdateProfile(c.Request.Context(), userID, &req)
	switch {
	case errors.Is(err, user.ErrUserExists):
		respond.Error(c, http.StatusConflict, "Никнейм или email уже заняты", nil)
		return
	case errors.Is(err, user.ErrNotFound):
		respond.Error(c, http.StatusUnauthorized, "Пользователь не найден", nil)
		return
	case err != nil:
		respond.Error(c, http.StatusInternalServerError, "Не удалось обновить профиль", err)
		return
	}

	profile, err := h.repo.User.GetProfileByID(c.Request.Context(), userID)
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось получить профиль", err)
		return
	}
	respond.OK(c, http.StatusOK, "Профиль обновлён", profile)
}

// ChangePassword меняет пароль после проверки текущего.
// @Summary      Смена пароля
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input  body      models.ChangePasswordRequest  true  "Текущий и новый пароль"
// @Success      200    {object}  models.ResponseApi
// @Failure      400    {object}  models.ResponseApi
// @Router       /auth/changepassword [post]
func (h *Handler) ChangePassword(c *gin.Context) {
	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respond.Error(c, http.StatusBadRequest, "Новый пароль должен быть не короче 6 символов", err)
		return
	}

	userID := contextkeys.String(c, contextkeys.UserIDKey)
	hash, err := h.repo.User.GetPasswordHash(c.Request.Context(), userID)
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось сменить пароль", err)
		return
	}
	// 400, а не 401: 401 фронтенд воспринимает как истёкшую сессию
	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.CurrentPassword)) != nil {
		respond.Error(c, http.StatusBadRequest, "Текущий пароль указан неверно", nil)
		return
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось сменить пароль", err)
		return
	}
	if err := h.repo.User.UpdatePasswordHash(c.Request.Context(), userID, string(newHash)); err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось сменить пароль", err)
		return
	}
	respond.OK(c, http.StatusOK, "Пароль изменён", nil)
}

// GetProfile возвращает публичный профиль по никнейму (email скрыт).
// @Summary      Профиль пользователя
// @Tags         auth
// @Produce      json
// @Param        username  path      string  true  "Никнейм"
// @Success      200       {object}  models.ResponseApi{result=models.Profile}
// @Failure      404       {object}  models.ResponseApi
// @Router       /auth/profile/{username} [get]
func (h *Handler) GetProfile(c *gin.Context) {
	profile, err := h.repo.User.GetProfileByUsername(c.Request.Context(), c.Param("username"))
	if errors.Is(err, user.ErrNotFound) {
		respond.Error(c, http.StatusNotFound, "Пользователь не найден", nil)
		return
	}
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось получить профиль", err)
		return
	}
	profile.Email = ""
	respond.OK(c, http.StatusOK, "Профиль получен", profile)
}
