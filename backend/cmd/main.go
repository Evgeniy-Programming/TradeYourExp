package main

import (
	"Trade-y-exp/internal/handler"
	"Trade-y-exp/internal/repository"
	"Trade-y-exp/pkg/db"
	"database/sql"
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
// @description     Trade Your Exp.
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

	dB, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer dB.Close()
	// Инициализация хранилища (Postgres)
	repo := repository.NewHMainRepository(dB)

	// Миграции
	db.RunMigrations(dB, "trade_db")

	// Обработчики
	h := handler.NewHMainHandler(*repo)

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
		v1.POST("/skills", h.Skills.CreateSkill)
		v1.DELETE("/skills/:id", h.Skills.DeleteSkill)
		v1.GET("/skills/:category", h.Skills.GetSkillByCategory)
		v1.GET("/skills/filter/:search", h.Skills.GetSkillByFilters)
		v1.GET("/skills/desc/:id", h.Skills.GetDescriptionByID)
		v1.GET("skills/desc", h.Skills.GetAllDescriptions)
		v1.POST("skills/desc", h.Skills.CreateDescription)
		v1.POST("skills/with-desc", h.Skills.CreateSkillWithDesc)
	}

	log.Printf("Starting server on :8080")
	if err := app.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
