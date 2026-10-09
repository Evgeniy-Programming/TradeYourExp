package contextkeys

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// ContextKey тип для ключей контекста
type ContextKey string

const (
	RequestIDKey ContextKey = "request_id"
	UserIDKey    ContextKey = "user_id"
	UsernameKey  ContextKey = "username"
	RoleKey      ContextKey = "role"
)

// String достаёт строковое значение из контекста gin; "" если его нет.
func String(c *gin.Context, key ContextKey) string {
	v, ok := c.Get(key)
	if !ok || v == nil {
		return ""
	}
	if s, ok := v.(string); ok {
		return s
	}
	return fmt.Sprint(v)
}
