package raiting

import (
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

type RaitRepository struct {
	db    *sql.DB
	redis *redis.Client
}

func NewRaitRepository(DB *sql.DB, redis *redis.Client) *RaitRepository {
	if DB == nil {
		return nil
	}
	return &RaitRepository{db: DB, redis: redis}
}
