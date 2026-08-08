package repository

import (
	"Trade-y-exp/internal/models"
	"context"
	"database/sql"
)

type Storage interface {
	// Пользователи
	CreateUser(u *models.User) error
	UpdateUser(u *models.User, id string) error
	DeleteUser(id string) error
	GetByEmail(email string) (*models.User, error)

	// Навыки
	SaveSkill(ctx context.Context, s *models.Skill) (int, error)
	DeleteSkill(id string) error
	FetchSkills() ([]models.Skill, error)
	GetSkilllByCategory(ctx context.Context, category string) (*[]models.Skill, error)
	GetAllDescriptions(ctx context.Context) ([]models.SkillDescription, error)
	GetDescriptionBySkillID(ctx context.Context, skillID int) (*models.SkillDescription, error)
	UpsertDescription(ctx context.Context, skillID int, description, media string) error
	// Системное
	GetDB() *sql.DB
}
