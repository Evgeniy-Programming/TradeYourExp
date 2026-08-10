package models

import (
	"time"

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

type Skill struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Skill    string `json:"skill"`
	Exchange string `json:"exchange"`
}

type SkillDescription struct {
	ID          int       `json:"id"`
	SkillID     int       `json:"skill_id"`    // FK к skills
	Description string    `json:"description"` // Подробное описание
	CreatedAt   time.Time `json:"created_at"`
	Media       string    `json:"media,omitempty"`
	Skill       string    `json:"skill,omitempty"`
	Exchange    string    `json:"exchange,omitempty"`
	Username    string    `json:"username,omitempty"`
}
