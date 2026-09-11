package skills

import (
	"Trade-y-exp/internal/models"
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
func (h *Handler) GetSkills(c *gin.Context) {
	list, err := h.repo.Skills.GetAllSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Failed to fetch",
		})
		return
	}

	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Skills successfull received",
		Result:    list,
	}

	c.JSON(http.StatusOK, responseApi)
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
func (h *Handler) GetSkillByCategory(c *gin.Context) {
	category := c.Param("category")
	if strings.TrimSpace(category) == "" {
		skills, err := h.repo.Skills.GetAllSkills()
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ResponseApi{
				Status:  false,
				Error:   err.Error(),
				Message: "DataBase Error",
			})
			return
		}
		c.JSON(http.StatusNotFound, skills)
		return
	}

	skills, err := h.repo.Skills.GetSkillByCategory(c.Request.Context(), strings.TrimSpace(category))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}

	if skills == nil || len(*skills) == 0 {
		c.JSON(http.StatusNotFound, models.ResponseApi{
			Status:  false,
			Message: "Category not found",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Skills by category successfull received",
		Result:    skills,
	}

	c.JSON(http.StatusOK, responseApi)
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
func (h *Handler) GetSkillByFilters(c *gin.Context) {
	search := c.Param("search")

	if strings.TrimSpace(search) == "" {
		// Если строка пустая — возвращаем все записи
		skills, err := h.repo.Skills.GetAllSkills()
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ResponseApi{
				Status:  false,
				Error:   err.Error(),
				Message: "DataBase Error",
			})
			return
		}
		c.JSON(http.StatusOK, models.ResponseApi{
			RequestID: "",
			Status:    true,
			Message:   "All skills successfull received",
			Result:    skills,
		})
		return
	}

	skills, err := h.repo.Skills.GetSkillByFilters(c.Request.Context(), strings.TrimSpace(search))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}

	if skills == nil || len(*skills) == 0 {
		c.JSON(http.StatusNotFound, models.ResponseApi{
			Status:  false,
			Message: "Parametres for search is not found",
		})
		return
	}
	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Skills by filter successfull received",
		Result:    skills,
	}

	c.JSON(http.StatusOK, responseApi)
}
