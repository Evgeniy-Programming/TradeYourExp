package models

type ResponseApi struct {
	RequestID string      `json:"request_id" example:"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`
	Status    bool        `json:"status" example:"true"`
	Error     string      `json:"error,omitempty"`
	Code      string      `json:"code,omitempty"` // [!] доработать код ошибки [!]
	Message   string      `json:"message,omitempty" example:"Information message"`
	Result    interface{} `json:"result,omitempty"`
}
