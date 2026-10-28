package respond

import (
	"log"

	"Trade-y-exp/internal/contextkeys"
	"Trade-y-exp/internal/models"

	"github.com/gin-gonic/gin"
)

// OK отправляет успешный ответ в общем формате ResponseApi.
func OK(c *gin.Context, status int, message string, result any) {
	c.JSON(status, models.ResponseApi{
		RequestID: contextkeys.String(c, contextkeys.RequestIDKey),
		Status:    true,
		Message:   message,
		Result:    result,
	})
}

// Error отправляет ошибку. message показывается пользователю на фронтенде,
// поэтому внутренняя причина (err) только логируется и клиенту не уходит.
func Error(c *gin.Context, status int, message string, err error) {
	requestID := contextkeys.String(c, contextkeys.RequestIDKey)
	if err != nil {
		log.Printf("[%s] %s %s: %s: %v", requestID, c.Request.Method, c.Request.URL.Path, message, err)
	}
	c.AbortWithStatusJSON(status, models.ResponseApi{
		RequestID: requestID,
		Status:    false,
		Message:   message,
	})
}
