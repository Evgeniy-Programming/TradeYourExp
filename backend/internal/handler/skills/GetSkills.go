package skills

import (
	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// GetSkills вывод списка скиллов всех пользователей.
// @Summary      Вывести все скиллы
// @Description  Вывод полного списка навыков.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.ResponseApi "Вывод пользовательских скиллов"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /skills [get]
func (h *Handler) GetSkills(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	list, err := h.repo.Skills.GetAllSkills()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Failed to fetch",
		})
		return
	}

	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Skills successfull received",
		Result:    list,
	}

	ctx.JSON(http.StatusOK, responseApi)
}

// GetSkillByCategory вывод списка скиллов по категории.
// @Summary      Вывести все скиллы по категории.
// @Description  Вывод полного списка скиллов по категории.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        category   path      string  true  "Категория скилла"
// @Success      200  {object}  models.ResponseApi "Вывод пользовательских скиллов"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Категория не найдена"
// @Router       /skills/{category} [get]
func (h *Handler) GetSkillByCategory(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	category := ctx.Param("category")
	if strings.TrimSpace(category) == "" {
		skills, err := h.repo.Skills.GetAllSkills()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
				Status:  false,
				Error:   err.Error(),
				Message: "DataBase Error",
			})
			return
		}
		ctx.JSON(http.StatusNotFound, skills)
		return
	}

	skills, err := h.repo.Skills.GetSkillsByCategory(ctx.Request.Context(), strings.TrimSpace(category))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}

	if len(skills) == 0 {
		ctx.JSON(http.StatusNotFound, models.ResponseApi{
			Status:  false,
			Message: "No data availbable",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Skills by category successfull received",
		Result:    skills,
	}

	ctx.JSON(http.StatusOK, responseApi)
}

// GetSkillByFilters вывод списка скиллов по ключевой строке.
// @Summary      Вывести все скиллы по вхождению в ключевую строку.
// @Description  Вывод полного списка скиллов по переданной строке.
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        search   path      string  true  "Ключевая строка поиска"
// @Success      200  {object}  models.ResponseApi "Вывод пользовательских скиллов"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Категория не найдена"
// @Router       /skills/filter/{search} [get]
func (h *Handler) GetSkillByFilters(ctx *gin.Context) {
	requestID, _ := ctx.Get(contextkeys.RequestIDKey)
	search := ctx.Param("search")

	if strings.TrimSpace(search) == "" {
		// Если строка пустая — возвращаем все записи
		skills, err := h.repo.Skills.GetAllSkills()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
				RequestID: fmt.Sprint(requestID),
				Status:    false,
				Error:     err.Error(),
				Message:   "DataBase Error",
			})
			return
		}
		ctx.JSON(http.StatusOK, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    true,
			Message:   "All skills successfull received",
			Result:    skills,
		})
		return
	}

	skills, err := h.repo.Skills.GetSkillByFilters(ctx.Request.Context(), strings.TrimSpace(search))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Error:     err.Error(),
			Message:   "DataBase Error",
		})
		return
	}

	if skills == nil || len(*skills) == 0 {
		ctx.JSON(http.StatusNotFound, models.ResponseApi{
			RequestID: fmt.Sprint(requestID),
			Status:    false,
			Message:   "Parametres for search is not found",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: fmt.Sprint(requestID),
		Status:    true,
		Message:   "Skills by filter successfull received",
		Result:    skills,
	}

	ctx.JSON(http.StatusOK, responseApi)
}
