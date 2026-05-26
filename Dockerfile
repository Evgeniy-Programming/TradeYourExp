FROM golang:alpine AS builder

# Устанавливаем системные зависимости
RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Разрешаем Go скачивать нужную версию (1.25), если её нет в образе
ENV GOTOOLCHAIN=auto
ENV GOPROXY=https://proxy.golang.org,direct

COPY go.mod go.sum* ./
RUN go mod download

COPY . .

# Сборка бинарника
RUN CGO_ENABLED=0 GOOS=linux go build -o /cmd ./cmd/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /root/
COPY --from=builder /cmd .
COPY --from=builder /app/sheets ./sheets
COPY --from=builder /app/func ./func
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080
CMD ["./cmd"]