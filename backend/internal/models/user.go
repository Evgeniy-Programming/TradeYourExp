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
