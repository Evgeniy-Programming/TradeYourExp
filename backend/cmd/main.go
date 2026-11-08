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

// @title           Swagger Example API
// @version         1.0
// @description     Trade Your Exp.
// @host      localhost:8080
// @BasePath  /api/v1
// @schemes http https

func main() {
	// === Database ===
	// PostgreSQL
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
	// Redis
	redisClient, err := db.NewClient(os.Getenv("REDIS_URL"))
	if err != nil {
		log.Fatal("Redis connection failed:", err)
	}
	defer redisClient.Close()
	// Repository
	repo := repository.NewHMainRepository(dB, redisClient)

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
	authCfg := handler.Config{
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
	app.Use(handler.RequestIDMiddleware())

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
		v1.POST("/logout", h.User.Logout)
		v1.POST("/refresh", h.User.RefreshToken)
		v1.GET("/skills", h.Skills.GetSkills)
		v1.GET("/skills/:category", h.Skills.GetSkillByCategory)
		v1.GET("/skills/filter/:search", h.Skills.GetSkillByFilters)

		protected := v1.Group("")
		protected.Use(handler.AuthMiddleware(authCfg))
		{
			skill := protected.Group("/skills")
			{
				skill.POST("/", h.Skills.CreateSkill)
				skill.DELETE("/:id", h.Skills.DeleteSkill)
				skill.GET("/desc/:id", h.Skills.GetDescriptionByID)
				skill.GET("/desc", h.Skills.GetAllDescriptions)
				skill.POST("/desc", h.Skills.CreateDescription)
				skill.POST("/with-desc", h.Skills.CreateSkillWithDesc)
				skill.PATCH("/:skill_id", h.Skills.ContributeSkill)
			}
			user := protected.Group("/users")
			{
				user.GET("/me", h.User.GetMyProfile)
				user.PUT("/me", h.User.UpdateMyProfile)
				user.PUT("/me/password", h.User.ChangePassword)
				user.GET("/me/static", h.User.GetMyProfileStatic)
				user.GET("/profile/:username", h.User.GetProfile)
			}
			rait := protected.Group("/rait")
			{
				rait.POST("/", h.Raiting.ChangeRait)
				rait.GET("/me", h.Raiting.GetMyRait)
				rait.GET("/user/:username", h.Raiting.GetUserRait)
				rait.GET("/history/me", h.Raiting.GetRaitHistory)
			}
		}

		admin := v1.Group("")
		admin.Use(
			handler.AuthMiddleware(authCfg),
			handler.RequireRole("admin"),
		)
		{
			admin.PUT("/users/:id", h.User.UpdateUser)
			admin.DELETE("/users/:id", h.User.DeleteUser)
			admin.POST("/rait/new", h.Raiting.UpdateRait)
			admin.GET("/history/:received_id", h.Raiting.GetInfluenceRait)
		}
	}

	log.Printf("Starting server on :8080")
	if err := app.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
