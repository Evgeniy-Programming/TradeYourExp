package models

import (
	"github.com/google/uuid"
)

type User struct {
	ID         uuid.UUID `json:"id"`
	Username   string    `json:"username"`
	Email      string    `json:"email"`
	Password   string    `json:"password,omitempty"` // omitempty чтобы не светить в API
	FirstName  string    `json:"firstName"`
	LastName   string    `json:"lastName"`
	SocialLink string    `json:"socialLink"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required,oneof=manager admin viewer"`
}
