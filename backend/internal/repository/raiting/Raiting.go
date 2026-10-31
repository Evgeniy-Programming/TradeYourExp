package raiting

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type RaitRepository struct {
	db *sql.DB
}

func NewRaitRepository(DB *sql.DB) *RaitRepository {
	if DB == nil {
		return nil
	}
	return &RaitRepository{db: DB}
}
