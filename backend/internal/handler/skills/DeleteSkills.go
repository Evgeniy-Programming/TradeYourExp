package skills

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	"Trade-y-exp/internal/handler/respond"

	"github.com/gin-gonic/gin"
)

// DeleteSkill удаляет обмен текущего пользователя.
// @Summary      Удалить обмен
// @Tags         skills
// @Produce      json
// @Param        id   path      string  true  "ID обмена"
// @Success      200  {object}  models.ResponseApi
// @Failure      404  {object}  models.ResponseApi
// @Router       /skills/{id} [delete]
func (h *Handler) DeleteSkill(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		respond.Error(c, http.StatusBadRequest, "Некорректный id обмена", nil)
		return
	}
	username, err := h.currentUsername(c)
	if err != nil {
		respond.Error(c, http.StatusUnauthorized, "Пользователь не найден", err)
		return
	}

	err = h.repo.Skills.DeleteSkill(c.Request.Context(), id, username)
	if errors.Is(err, sql.ErrNoRows) {
		respond.Error(c, http.StatusNotFound, "Обмен не найден", nil)
		return
	}
	if err != nil {
		respond.Error(c, http.StatusInternalServerError, "Не удалось удалить обмен", err)
		return
	}
	respond.OK(c, http.StatusOK, "Обмен удалён", strconv.Itoa(id))
}
