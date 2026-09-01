# Build stage
FROM golang:alpine AS builder

WORKDIR /app

# Install protoc for proto generation
RUN apk add --no-cache protobuf-dev

ENV GOTOOLCHAIN=auto
ENV GOPROXY=https://proxy.golang.org,direct

COPY go.mod go.sum* ./
RUN go mod download -x && touch /tmp/force-rebuild

# Generate gRPC code from shared proto
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /cmd ./cmd/server

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o auth_service ./cmd/server

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/auth_service .

EXPOSE 50051

CMD ["./auth_service"]