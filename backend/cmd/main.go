package main

import (
	"Trade-y-exp/internal/handler"
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

// @title           Trade Your Exp API
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

	if err := dB.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

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

	// === Auth Middleware ===
	requireAuth := handler.AuthMiddleware(handler.Config{
		JWTSecret: os.Getenv("JWT_SECRET"),
	}, authClient)

	// === Handler Initialization ===
	h := handler.NewHMainHandler(*repo, authClient)

	// === Gin Setup ===
	app := gin.Default()
	app.Use(handler.RequestIDMiddleware())

	// CORS нужен только при обращении к API напрямую, в обход прокси Vite
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173"
	}
	app.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", corsOrigin)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
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
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/register", h.Auth.Register)
			authGroup.POST("/login", h.Auth.Login)
			authGroup.POST("/refresh", h.Auth.Refresh)
			authGroup.POST("/logout", h.Auth.Logout)

			authGroup.GET("/me", requireAuth, h.Auth.Me)
			authGroup.PUT("/update", requireAuth, h.Auth.Update)
			authGroup.POST("/changepassword", requireAuth, h.Auth.ChangePassword)
			authGroup.GET("/profile/:username", requireAuth, h.Auth.GetProfile)
		}

		v1.GET("/skills", h.Skills.GetSkills)
		v1.GET("/skills/:category", h.Skills.GetSkillByCategory)
		v1.GET("/skills/filter/:search", h.Skills.GetSkillByFilters)

		protected := v1.Group("")
		protected.Use(requireAuth)
		{
			protected.POST("/skills", h.Skills.CreateSkill)
			protected.GET("/skills/my", h.Skills.GetMySkills)
			protected.GET("/skills/my/stats", h.Skills.GetMyStats)
			protected.DELETE("/skills/:id", h.Skills.DeleteSkill)
			protected.GET("/skills/desc/:id", h.Skills.GetDescriptionByID)
			protected.GET("/skills/desc", h.Skills.GetAllDescriptions)
			protected.POST("/skills/desc", h.Skills.CreateDescription)
		}

		admin := v1.Group("")
		admin.Use(requireAuth, handler.RequireRole("admin"))
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
