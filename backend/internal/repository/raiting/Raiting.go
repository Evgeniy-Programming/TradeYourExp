package raiting

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Repository struct {
	db *sql.DB
}

func NewRaitingRepository(DB *sql.DB) *Repository {
	if DB == nil {
		return nil
	}
	return &Repository{db: DB}
}
