package skills

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type SkillRepository struct {
	db *sql.DB
}

func NewSkillRepository(DB *sql.DB) *SkillRepository {
	if DB == nil {
		return nil
	}
	return &SkillRepository{db: DB}
}
