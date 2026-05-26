package repository

import (
	"Trade-y-exp/internal/models"
	"database/sql"
)

type Storage interface {
	// Пользователи
	CreateUser(u *models.User) error
	UpdateUser(u *models.User, id string) error
	DeleteUser(id string) error
	GetByEmail(email string) (*models.User, error)

	// Навыки
	SaveSkill(s *models.Skill) error
	DeleteSkill(id string) error
	FetchSkills() ([]models.Skill, error)

	// Системное
	GetDB() *sql.DB
}
