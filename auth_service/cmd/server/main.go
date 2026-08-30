package main

import (
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"google.golang.org/grpc"

	"Trade-y-exp/auth_service/internal/handler"
	"Trade-y-exp/auth_service/internal/repository"
	"Trade-y-exp/auth_service/pkg/jwt"
	authpb "Trade-y-exp/auth_service/proto/auth"
)

func main() {
	// from env
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://user:pass@db:5432/trade_db?sslmode=disable"
	}

	grpcPort := os.Getenv("GRPC_PORT")
	if grpcPort == "" {
		grpcPort = "50051"
	}

	// DB connection
	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	// Проверка подключения
	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}
	log.Println("Connected to database")

	// Init components
	userRepo := repository.NewUserRepo(db)
	jwtMgr := jwt.NewManager()
	authHandler := handler.NewAuth(userRepo, jwtMgr)

	// gRPC server
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", grpcPort))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	authpb.RegisterAuthServiceServer(grpcServer, authHandler)

	log.Printf("Auth service starting on port %s", grpcPort)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
