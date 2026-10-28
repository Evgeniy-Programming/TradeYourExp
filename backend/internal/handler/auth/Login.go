package auth

import (
	"errors"
	"net/http"
	"strings"

	"Trade-y-exp/internal/handler/respond"
	"Trade-y-exp/internal/models"
	"Trade-y-exp/internal/repository/user"
	authpb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const invalidCredentials = "Неверный логин или пароль"

// Login авторизует по никнейму или email и ставит HttpOnly-cookie с токенами.
// @Summary      Вход
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input  body      models.AuthLoginRequest  true  "Логин (никнейм или email) и пароль"
// @Success      200    {object}  models.ResponseApi{result=models.Profile}
// @Failure      400    {object}  models.ResponseApi
// @Failure      401    {object}  models.ResponseApi
// @Router       /auth/login [post]
func (h *Handler) Login(c *gin.Context) {
	var req models.AuthLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respond.Error(c, http.StatusBadRequest, "Введите логин и пароль", err)
		return
	}

	username := strings.TrimSpace(req.Login)
	if req.Type == "email" || (req.Type == "" && strings.Contains(username, "@")) {
		var err error
		username, err = h.repo.User.GetUsernameByEmail(c.Request.Context(), username)
		if errors.Is(err, user.ErrNotFound) {
			respond.Error(c, http.StatusUnauthorized, invalidCredentials, nil)
			return
		}
		if err != nil {
			respond.Error(c, http.StatusInternalServerError, "Не удалось войти", err)
			return
		}
	}

	ctx, cancel := h.grpcContext(c)
	defer cancel()

	resp, err := h.authClient.Login(ctx, &authpb.LoginRequest{Username: username, Password: req.Password})
	if err != nil {
		if status.Code(err) == codes.Unauthenticated {
			respond.Error(c, http.StatusUnauthorized, invalidCredentials, nil)
			return
		}
		respond.Error(c, http.StatusInternalServerError, "Сервис авторизации недоступен", err)
		return
	}

	profile, err := h.repo.User.GetProfileByID(c.Request.Context(), resp.GetUserId())
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось получить профиль", err)
		return
	}

	h.setAuthCookies(c, resp)
	respond.OK(c, http.StatusOK, "Вход выполнен", profile)
}
