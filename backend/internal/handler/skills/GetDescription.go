package skills

import (
	"Trade-y-exp/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetDescriptionByID вывод доп. описания по Skill ID.
// @Summary      Вывод описания по skill_id
// @Description  Выводит описание по персональному skill_id
// @Tags         skills
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Вывод описания по skill_id"
// @Success      200  {object}  models.ResponseApi  "Вывод пользователя"
// @Failure      400  {object}  models.ResponseApi "Неверный формат Skill ID"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /skills/desc/{id} [get]
func (h *Handler) GetDescriptionByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "Invalid skill id",
		})
		return
	}

	desc, err := h.repo.Skills.GetDescriptionBySkillID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}

	if desc == nil {
		c.JSON(http.StatusNotFound, models.ResponseApi{
			Status:  false,
			Message: "Description not found",
		})
		return
	}

	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Description successfull received",
		Result:    desc,
	}

	c.JSON(http.StatusOK, responseApi)
}

// GetAllDescriptions вывод списка всех доп. описаний.
// @Summary      Вывести все доп.описания
// @Description  Вывод полного дополнительных описаний
// @Tags         skills
// @Accept       json
// @Produce      json
// @Success      200  {object}  models.ResponseApi "Вывод списка доп. описаний"
// @Failure      400  {object}  models.ResponseApi "Неверный формат"
// @Failure      404  {object}  models.ResponseApi "Пользователь не найден"
// @Router       /skills/desc [get]
func (h *Handler) GetAllDescriptions(c *gin.Context) {
	descs, err := h.repo.Skills.GetAllDescriptions(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseApi{
			Status:  false,
			Error:   err.Error(),
			Message: "DataBase Error",
		})
		return
	}

	// пустой массив вместо null, чтобы JS на фронте не падал при переборе
	if descs == nil {
		descs = []models.SkillDescription{}
	}
	responseApi := models.ResponseApi{
		RequestID: "", // доделать с MiddleWare
		Status:    true,
		Message:   "Description list successfull received",
		Result:    descs,
	}
	c.JSON(http.StatusOK, responseApi)
}
