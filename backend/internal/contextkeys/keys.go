package contextkeys

// ContextKey тип для ключей контекста
type ContextKey string

const (
	RequestIDKey ContextKey = "request_id"
	UserIDKey    ContextKey = "user_id"
	UsernameKey  ContextKey = "username"
	RoleKey      ContextKey = "role"
)
