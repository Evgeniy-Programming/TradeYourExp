package models

import "time"

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

// SkillCard — карточка обмена в формате фронтенда (ISkill / ISkillHistory).
type SkillCard struct {
	ID             int       `json:"id,string"`
	Category       string    `json:"category"`
	Description    string    `json:"description"`
	Skill          string    `json:"skill"`
	Exchange       string    `json:"exchange"`
	ContactType    string    `json:"contactType"`
	ContactValue   *string   `json:"contactValue"`
	Username       string    `json:"username"`
	AvatarUsername *string   `json:"avatarUsername"`
	CreatedAt      time.Time `json:"createdAt"`
	Status         string    `json:"status"`
}

// SkillCreateRequest — создание обмена (IEditSkill).
type SkillCreateRequest struct {
	Category     string  `json:"category" binding:"required"`
	Skill        string  `json:"skill" binding:"required"`
	Exchange     string  `json:"exchange" binding:"required"`
	Description  string  `json:"description"`
	ContactType  string  `json:"contactType" binding:"omitempty,oneof=site telegram vk wechat"`
	ContactValue *string `json:"contactValue"`
}

// SkillFilter — параметры выборки ленты обменов.
type SkillFilter struct {
	Category string
	Search   string
	// SearchIn: "" — по всем полям, "skill" — по предлагаемому навыку, "exchange" — по желаемому.
	SearchIn string
	Username string
}

type SkillStatsMonth struct {
	Month string `json:"month"`
	Count int    `json:"count"`
}

// SkillStats — статистика пользователя для StatsPage.
type SkillStats struct {
	Total   int               `json:"total"`
	Active  int               `json:"active"`
	Closed  int               `json:"closed"`
	ByMonth []SkillStatsMonth `json:"byMonth"`
}
