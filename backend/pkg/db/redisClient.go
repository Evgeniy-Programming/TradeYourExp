package db

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// NewClient создает и настраивает подключение к Redis
func NewClient(redisURL string) (*redis.Client, error) {
	// redis://localhost:6379 или просто адрес:порт
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("parse redis url: %w", err)
	}

	opt.PoolSize = 10                 // Максимум одновременных подключений
	opt.MinIdleConns = 2              // Минимум "теплых" подключений
	opt.ConnMaxLifetime = time.Minute // Пересоздавать соединения раз в минуту (защита от разрывов)

	client := redis.NewClient(opt)

	// Проверяем соединение при старте
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("redis ping failed: %w", err)
	}

	return client, nil
}
