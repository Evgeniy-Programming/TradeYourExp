package skills

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/repository"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo repository.Repository
}

func NewSkillHandler(repo repository.Repository) *Handler {
	return &Handler{repo: repo}
}

// currentUsername берёт актуальный никнейм из БД: в JWT он может быть устаревшим после смены в профиле.
func (h *Handler) currentUsername(c *gin.Context) (string, error) {
	profile, err := h.repo.User.GetProfileByID(c.Request.Context(), contextkeys.String(c, contextkeys.UserIDKey))
	if err != nil {
		return "", err
	}
	return profile.Username, nil
}
