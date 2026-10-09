package repository

import (
	"Trade-y-exp/internal/repository/skills"
	"Trade-y-exp/internal/repository/user"
	"database/sql"
)

type Repository struct {
	Skills skills.Repository
	User   user.Repository
}

func NewHMainRepository(DB *sql.DB) *Repository {
	return &Repository{
		User:   *user.NewUserRepository(DB),
		Skills: *skills.NewSkillRepository(DB),
	}
}
