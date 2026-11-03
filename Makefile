SERVICE_NAME=trade_exp
GO_FILES=$(shell find . -name '*.go')

# --- Docker ---

#Запуск всех контейнеров в фоновом режиме
up:
	@echo "Starting Docker containers..."
	@docker-compose up -d

#Остановка и удаление контейнеров
down:
	@echo "Stopping Docker containers..."
	@docker-compose down

#Логирование докер-контейнеров
logs:
	@docker-compose logs -f

# --- Go Application ---

#Основной код
run:
	@echo "Running the main service..."
	@go run ./backend/cmd/main.go

#Установка зависимостей
tidy:
	@cd backend
	@echo "Tidying Go modules..."
	@go mod tidy

#Установка библиотек(валидатор etc.)
install-deps: tidy
	@cd backend
	@echo "Installing dependencies..."
	@go get github.com/go-playground/validator/v10
	@go get github.com/go-chi/chi/v5
	@go get github.com/brianvoe/gofakeit/v6
	@go get go.uber.org/mock/mockgen@latest

swag-gen:
	@swag init -d ./cmd,internal,internal/models -o ./docs

.PHONY: up down logs run tidy install-deps migrate-up publish start