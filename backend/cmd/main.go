package main

import (
	"Trade-y-exp/internal/handler"
	"Trade-y-exp/internal/middleware"
	"Trade-y-exp/internal/repository"
	"Trade-y-exp/pkg/db"
	authpb "Trade-y-exp/proto/auth"
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "Trade-y-exp/docs"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// @title           Swagger Example API
// @version         1.0
// @description     Trade Your Exp.
// @host      localhost:8080
// @BasePath  /api/v1
// @schemes http https

func main() {
	// === Database ===
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/trade_db?sslmode=disable"
	}

	dB, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer dB.Close()

	db.RunMigrations(dB, "trade_db")
	repo := repository.NewHMainRepository(dB)

	// === gRPC Client to Auth Service ===
	authAddr := os.Getenv("AUTH_SERVICE_ADDR")
	if authAddr == "" {
		authAddr = "auth:50051"
	}

	conn, err := grpc.NewClient(authAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("failed to connect to auth service: %v", err)
	}
	defer conn.Close()

	authClient := authpb.NewAuthServiceClient(conn)

	// === Auth Middleware Config ===
	authCfg := middleware.Config{
		AuthServiceAddr: authAddr,
		JWTSecret:       os.Getenv("JWT_SECRET"),
		PublicPaths: []string{
			"/api/v1/login",
			"/api/v1/register",
			"/swagger/*any",
			"/",
		},
	}

	// === Handler Initialization ===
	h := handler.NewHMainHandler(*repo, authClient)

	// === Gin Setup ===
	app := gin.Default()

	// CORS
	app.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// Static & Templates
	app.Static("/func", "./func")
	app.LoadHTMLGlob("sheets/*")

	// Swagger
	app.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	app.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"Title": "Trade Your Exp"})
	})

	// === API Routes ===
	v1 := app.Group("/api/v1")
	{
		v1.POST("/register", h.User.Register)
		v1.POST("/login", h.User.Login)
		v1.GET("/skills", h.Skills.GetSkills)
		v1.GET("/skills/:category", h.Skills.GetSkillByCategory)
		v1.GET("/skills/filter/:search", h.Skills.GetSkillByFilters)

		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(authCfg))
		{
			protected.POST("/skills", h.Skills.CreateSkill)
			protected.DELETE("/skills/:id", h.Skills.DeleteSkill)
			protected.GET("/skills/desc/:id", h.Skills.GetDescriptionByID)
			protected.GET("/skills/desc", h.Skills.GetAllDescriptions)
			protected.POST("/skills/desc", h.Skills.CreateDescription)
			protected.POST("/skills/with-desc", h.Skills.CreateSkillWithDesc)
		}

		admin := v1.Group("")
		admin.Use(
			middleware.AuthMiddleware(authCfg),
			middleware.RequireRole("admin"),
		)
		{
			admin.PUT("/users/:id", h.User.UpdateUser)
			admin.DELETE("/users/:id", h.User.DeleteUser)
		}
	}

	log.Printf("Starting server on :8080")
	if err := app.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
