package db

import (
	"errors"
	"log"

	"database/sql"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations(db *sql.DB, databaseName string) {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatal("migration driver error: ", err)
	}

	// Указываем путь к папке с .sql файлами
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		databaseName,
		driver,
	)
	if err != nil {
		log.Fatal("migration init error: ", err)
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatal("migration failed: ", err)
	}

	log.Println("Migrations applied successfully!")
}
