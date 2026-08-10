package repository

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type PgRepo struct {
	db *sql.DB
}

func NewPg(connStr string) (*PgRepo, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return &PgRepo{db: db}, db.Ping()
}

func (r *PgRepo) GetDB() *sql.DB {
	return r.db
}
