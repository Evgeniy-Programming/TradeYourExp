package main

import (
	"Trade-y-exp/internal/handler"
	"Trade-y-exp/internal/repository"
	"Trade-y-exp/pkg/db"
	"log"
	"net/http"
	"os"

	_ "Trade-y-exp/docs"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Swagger Example API
// @version         1.0
// @description      Это сервер для управления пользователями.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api/v1

// @schemes http https
func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/trade_db?sslmode=disable"
	}

	// Инициализация хранилища (Postgres)
	repo, err := repository.NewPg(dsn)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}

	// Миграции
	db.RunMigrations(repo.GetDB(), "trade_db")

	// Обработчики
	h := handler.NewHMainHandler(repo)

	app := gin.Default()

	// Статика и шаблоны
	app.Static("/func", "./func")
	app.LoadHTMLGlob("sheets/*")

	app.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	app.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"Title": "Trade Your Exp",
		})
	})

	// API
	v1 := app.Group("/api/v1")
	{
		v1.POST("/register", h.User.Register)
		v1.POST("/login", h.User.Login)
		v1.PUT("/users/:id", h.User.UpdateUser)
		v1.DELETE("/users/:id", h.User.DeleteUser)
		v1.GET("/skills", h.Skills.GetSkills)
		v1.POST("/skills", h.Skills.AddSkill)
		v1.DELETE("/skills/:id", h.Skills.DeleteSkill)
	}

	log.Printf("Starting server on :8080")
	if err := app.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
