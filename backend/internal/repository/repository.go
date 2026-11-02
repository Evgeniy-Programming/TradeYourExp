package repository

import (
	"Trade-y-exp/internal/models"
	"Trade-y-exp/internal/repository/raiting"
	"Trade-y-exp/internal/repository/skills"
	"Trade-y-exp/internal/repository/user"
	"context"
	"database/sql"
)

type SkillRepository interface {
	SaveSkill(ctx context.Context, s *models.Skill) (int, error)
	DeleteSkill(id string) error
	FetchSkills() ([]models.SkillFull, error)
	GetSkilllByCategory(ctx context.Context, category string) (*[]models.SkillFull, error)
	GetSkillByFilters(ctx context.Context, search string) (*[]models.SkillFull, error)
	GetAllDescriptions(ctx context.Context) ([]models.SkillDescription, error)
	GetDescriptionBySkillID(ctx context.Context, skillID int) (*models.SkillDescription, error)
	UpsertDescription(ctx context.Context, skillID int, description, media string) error
	ContributeSkill(ctx context.Context, request models.SkillContribute) error
}

type UserRepository interface {
	CreateUser(u *models.User) error
	UpdateUser(u *models.User, id string) error
	DeleteUser(id string) error
	GetByEmail(email string) (*models.User, error)
	GetMyProfile(userId string) (*models.ProfileRequest, error)
	GetProfile(username string) (*models.ProfileRequest, error)
	GetMyProfileStatic(userId string) (*models.ProfileRequest, error)
	GetUsernameByEmail(email string) (string, error)
	UpdateProfile(u *models.UpdateProfileRequest, id string) error
	GetPasswordHash(id string) (string, error)
	UpdatePassword(hash, id string) error
}

type RaitingRepository interface {
	ChangeRait(ctx context.Context, request models.LogicRaitRequest) error
	UpdateRait(ctx context.Context, request models.LogicRaitRequest) error
	GetMyRait(userId string) (string, error)
	GetUserRait(username string) (string, error)
	GetRaitHistory(id string) ([]models.Raiting, error)
}

type Repository struct {
	Skills  *skills.SkillRepository
	User    *user.Repository
	Raiting *raiting.RaitRepository
	DB      *sql.DB
}

func NewHMainRepository(DB *sql.DB) *Repository {
	return &Repository{
		User:    user.NewUserRepository(DB),
		Skills:  skills.NewSkillRepository(DB),
		Raiting: raiting.NewRaitRepository(DB),
	}
}
