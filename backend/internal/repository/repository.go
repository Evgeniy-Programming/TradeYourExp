package repository

import (
	"Trade-y-exp/internal/models"
	"Trade-y-exp/internal/repository/skills"
	"Trade-y-exp/internal/repository/user"
	"context"
	"database/sql"
)

type SkillRepository interface {
	SaveSkill(ctx context.Context, s *models.Skill) (int, error)
	DeleteSkill(id string) error
	FetchSkills() ([]models.Skill, error)
	GetSkilllByCategory(ctx context.Context, category string) (*[]models.Skill, error)
	GetSkillByFilters(ctx context.Context, search string) (*[]models.SkillFull, error)
	GetAllDescriptions(ctx context.Context) ([]models.SkillDescription, error)
	GetDescriptionBySkillID(ctx context.Context, skillID int) (*models.SkillDescription, error)
	UpsertDescription(ctx context.Context, skillID int, description, media string) error
}

type UserRepository interface {
	CreateUser(u *models.User) error
	UpdateUser(u *models.User, id string) error
	DeleteUser(id string) error
	GetByEmail(email string) (*models.User, error)
}

type Repository struct {
	Skills skills.Repository
	User   user.Repository
	DB     *sql.DB
}

func NewHMainRepository(DB *sql.DB) *Repository {
	return &Repository{
		User:   *user.NewUserRepository(DB),
		Skills: *skills.NewSkillRepository(DB),
	}
}
