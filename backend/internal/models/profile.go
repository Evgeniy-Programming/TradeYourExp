package models

import "time"

// Profile — профиль пользователя в формате фронтенда (IProfile).
type Profile struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email,omitempty"`
	FirstName *string   `json:"firstName"`
	LastName  *string   `json:"lastName"`
	Link      *string   `json:"link"`
	CreatedAt time.Time `json:"createdAt"`
}

// ProfileUpdate — частичное обновление профиля (IEditProfile), nil-поля не меняются.
type ProfileUpdate struct {
	Username  *string `json:"username"`
	Email     *string `json:"email" binding:"omitempty,email"`
	FirstName *string `json:"firstName"`
	LastName  *string `json:"lastName"`
	Link      *string `json:"link"`
}

type AuthRegisterRequest struct {
	Username  string `json:"username" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Link      string `json:"link"`
}

type AuthLoginRequest struct {
	Type     string `json:"type" binding:"omitempty,oneof=email username"`
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=6"`
}
