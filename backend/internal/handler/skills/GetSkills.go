package skills

import (
	"errors"
	"net/http"

	"Trade-y-exp/internal/handler/respond"
	"Trade-y-exp/internal/models"
	skillsrepo "Trade-y-exp/internal/repository/skills"

	"github.com/gin-gonic/gin"
)

func (h *Handler) listSkills(c *gin.Context, filter models.SkillFilter) {
	cards, err := h.repo.Skills.ListSkills(c.Request.Context(), filter)
	if errors.Is(err, skillsrepo.ErrInvalidCategory) {
		respond.Error(c, http.StatusBadRequest, "Неизвестная категория", nil)
		return
	}
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось загрузить обмены", err)
		return
	}
	respond.OK(c, http.StatusOK, "Обмены получены", cards)
}

// GetSkills вывод ленты обменов с фильтрами.
// @Summary      Лента обменов
// @Tags         skills
// @Produce      json
// @Param        category  query     string  false  "Код категории (it, communicate, art, knowledge, hobby)"
// @Param        search    query     string  false  "Строка поиска"
// @Param        searchIn  query     string  false  "Где искать: skill — предлагаемый навык, exchange — желаемый; пусто — везде"
// @Success      200       {object}  models.ResponseApi{result=[]models.SkillCard}
// @Failure      400       {object}  models.ResponseApi
// @Router       /skills [get]
func (h *Handler) GetSkills(c *gin.Context) {
	searchIn := c.Query("searchIn")
	if searchIn != "" && searchIn != "skill" && searchIn != "exchange" {
		respond.Error(c, http.StatusBadRequest, "Некорректный параметр searchIn", nil)
		return
	}
	h.listSkills(c, models.SkillFilter{
		Category: c.Query("category"),
		Search:   c.Query("search"),
		SearchIn: searchIn,
	})
}

// GetSkillByCategory вывод обменов по категории.
// @Summary      Обмены по категории
// @Tags         skills
// @Produce      json
// @Param        category  path      string  true  "Код категории"
// @Success      200       {object}  models.ResponseApi{result=[]models.SkillCard}
// @Failure      400       {object}  models.ResponseApi
// @Router       /skills/{category} [get]
func (h *Handler) GetSkillByCategory(c *gin.Context) {
	h.listSkills(c, models.SkillFilter{Category: c.Param("category")})
}

// GetSkillByFilters вывод обменов по строке поиска.
// @Summary      Поиск обменов
// @Tags         skills
// @Produce      json
// @Param        search  path      string  true  "Строка поиска"
// @Success      200     {object}  models.ResponseApi{result=[]models.SkillCard}
// @Router       /skills/filter/{search} [get]
func (h *Handler) GetSkillByFilters(c *gin.Context) {
	h.listSkills(c, models.SkillFilter{Search: c.Param("search")})
}

// GetMySkills вывод обменов текущего пользователя (история).
// @Summary      Мои обмены
// @Tags         skills
// @Produce      json
// @Success      200  {object}  models.ResponseApi{result=[]models.SkillCard}
// @Router       /skills/my [get]
func (h *Handler) GetMySkills(c *gin.Context) {
	username, err := h.currentUsername(c)
	if err != nil {
		respond.Error(c, http.StatusUnauthorized, "Пользователь не найден", err)
		return
	}
	h.listSkills(c, models.SkillFilter{Username: username})
}

// GetMyStats статистика обменов текущего пользователя.
// @Summary      Моя статистика
// @Tags         skills
// @Produce      json
// @Success      200  {object}  models.ResponseApi{result=models.SkillStats}
// @Router       /skills/my/stats [get]
func (h *Handler) GetMyStats(c *gin.Context) {
	username, err := h.currentUsername(c)
	if err != nil {
		respond.Error(c, http.StatusUnauthorized, "Пользователь не найден", err)
		return
	}
	stats, err := h.repo.Skills.GetStats(c.Request.Context(), username)
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось загрузить статистику", err)
		return
	}
	respond.OK(c, http.StatusOK, "Статистика получена", stats)
}
