package skills

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Repository struct {
	db *sql.DB
}

func NewSkillRepository(DB *sql.DB) *Repository {
	if DB == nil {
		return nil
	}
	return &Repository{db: DB}
}

// func (r *Repository) GetDB() *sql.DB {
// 	return r.db
// }
