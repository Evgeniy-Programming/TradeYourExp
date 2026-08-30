### Trade Your Experience (или TYE)

# Цель разработки:

В условиях растущей коммерциализации индивидуального обучения и усиления цифрового неравенства платформа
предлагает альтернативную модель peer-to-peer образования, основанную на взаимовыгодном бартере экспертизы.
Инновационный потенциал проекта заключается в смещении фокуса с монетизированной передачи знаний на создание децентрализованных сообществ взаимного развития. Платформа устраняет ключевое ограничение традиционных EdTech-решений, где ценность создаётся односторонне и привязана к платежеспособности аудитории. Вместо этого система
формирует среду, в которой каждый участник одновременно выступает наставником и учеником, а валютой взаимодействия становится экспертиза, время и готовность делиться опытом.

Созданный прототип доказывает технологическую и социальную жизнеспособность концепции цифрового бартера знаний и
закладывает фундамент для развития доступных, человеко-ориентированных образовательных платформ нового поколения, способных трансформировать традиционные модели обучения в открытые, самоподдерживающиеся сети взаимного развития.

*Структура проекта*

```
Trade-y-exp/
├── docker-compose.yml          # Оркестрация: db(PostgreSQL) + app(backend) + auth + frontend
├── .env.example                        # Секреты
│
├── proto/                      # [!!] ОБЩИЕ ПРОТОКОЛЫ (контракты gRPC)
│   └── auth.proto              # AuthService: Login, Register, Validate
│
├── backend/                    # [!] Основной API (HTTP + gRPC client)
│   ├── cmd/main.go             # Точка входа, инициализация middleware
│   ├── internal/
│   │   ├── handler/            # HTTP handlers
│   │   │   ├── handler.go      # Композит: User + Skills handlers
│   │   │   ├── user/           # Auth endpoints (прокси в auth_service)
│   │   │   │   ├── login.go    # POST /login → gRPC → Set-Cookie
│   │   │   │   └── register.go # POST /register → gRPC → bcrypt
│   │   │   └── skills/         # Business logic endpoints
│   │   ├── middleware/         # [!] Auth middleware
│   │   │   └── auth.go         # JWT validation + role checks
│   │   └── repository/         # Data access layer
│   ├── pkg/
│   │   └── db/                 # Миграции PostgreSQL
│   ├── proto/auth/             # Сгенерированный gRPC код
│   │   ├── auth.pb.go
│   │   └── auth_grpc.pb.go
│   ├── Dockerfile
│   └── go.mod
│
├── auth_service/               # [!] Сервис авторизации (gRPC server)
│   ├── cmd/server/main.go      # gRPC server entry point
│   ├── internal/
│   │   ├── handler/auth.go     # gRPC handlers: Login/Register/Validate
│   │   ├── repository/user.go  # PostgreSQL access for users table
│   │   └── model/user.go       # User struct + TokenClaims
│   ├── pkg/jwt/
│   │   └── token.go            # JWT generation + validation (HS256)
│   ├── proto/auth/             # Сгенерированный gRPC код
│   ├── Dockerfile
│   └── go.mod
│
├── frontend/                   # React + Vite (новый)
│   ├── src/api/client.ts       # Axios с withCredentials: true
│   └── ...
│
└── docs/                       # Swagger docs (auto-generated)
```

## Запуск:

```bash
docker-compose up 
```

## Загрузка документации Swagger:
```bash
swag init -d ./cmd,internal -o ./docs
```