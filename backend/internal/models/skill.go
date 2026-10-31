package models

import (
	"time"

	"github.com/google/uuid"
)

type Skill struct {
	ID          int       `json:"id"`
	Username    string    `json:"username"`
	Skill       string    `json:"skill"`
	Exchange    string    `json:"exchange"`
	Category    string    `json:"category"`
	Status      string    `json:"status"`
	Contributer uuid.UUID `json:"contributer"`
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

type SkillFull struct {
	ID          int       `json:"id"`
	Username    string    `json:"username"`
	Skill       string    `json:"skill"`
	Exchange    string    `json:"exchange"`
	Category    string    `json:"category"`
	Status      string    `json:"status"`
	Contributer uuid.UUID `json:"contributer"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Media       string    `json:"media,omitempty"`
}

type SkillContribute struct {
	SkillID  string `json:"skill_id"`
	ID       string `json:"id"`
	Username string `json:"username"`
}
