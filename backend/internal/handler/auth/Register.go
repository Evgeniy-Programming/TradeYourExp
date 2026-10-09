package auth

import (
	"log"
	"net/http"
	"strings"

	"Trade-y-exp/internal/handler/respond"
	"Trade-y-exp/internal/models"
	authpb "Trade-y-exp/proto/auth"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// роль назначается сервером, клиент её не выбирает
const defaultRole = "manager"

// Register регистрирует пользователя через auth-service.
// @Summary      Регистрация
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input  body      models.AuthRegisterRequest  true  "Данные пользователя"
// @Success      201    {object}  models.ResponseApi{result=models.Profile}
// @Failure      400    {object}  models.ResponseApi
// @Failure      409    {object}  models.ResponseApi
// @Router       /auth/register [post]
func (h *Handler) Register(c *gin.Context) {
	var req models.AuthRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respond.Error(c, http.StatusBadRequest, "Заполните никнейм, корректный email и пароль не короче 6 символов", err)
		return
	}
	req.Username = strings.TrimSpace(req.Username)
	req.Email = strings.TrimSpace(req.Email)

	ctx, cancel := h.grpcContext(c)
	defer cancel()

	resp, err := h.authClient.Register(ctx, &authpb.RegisterRequest{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password, // auth-service сам захеширует через bcrypt
		Role:     defaultRole,
	})
	if err != nil {
		if status.Code(err) == codes.AlreadyExists {
			respond.Error(c, http.StatusConflict, "Пользователь с таким никнеймом или email уже существует", nil)
			return
		}
		respond.Error(c, http.StatusInternalServerError, "Не удалось зарегистрироваться", err)
		return
	}

	if err := h.repo.User.SetProfileDetails(c.Request.Context(), resp.GetUserId(), req.FirstName, req.LastName, req.Link); err != nil {
		// пользователь уже создан — необязательные поля можно дозаполнить в профиле
		log.Printf("register: save profile details for %s: %v", resp.GetUserId(), err)
	}

	profile, err := h.repo.User.GetProfileByID(c.Request.Context(), resp.GetUserId())
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось получить профиль", err)
		return
	}
	respond.OK(c, http.StatusCreated, "Пользователь зарегистрирован", profile)
}
