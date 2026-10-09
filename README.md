# Trade Your Experience (TYE)

Платформа для обмена навыками по бартеру: пользователь предлагает то, чему может научить, и указывает, что хочет получить взамен.

## Краткое описание

В условиях растущей коммерциализации индивидуального обучения и усиления цифрового неравенства платформа предлагает альтернативную модель peer-to-peer образования, основанную на взаимовыгодном бартере экспертизы. Инновационный потенциал проекта заключается в смещении фокуса с монетизированной передачи знаний на создание децентрализованных сообществ взаимного развития. Платформа устраняет ключевое ограничение традиционных EdTech-решений, где ценность создаётся односторонне и привязана к платежеспособности аудитории. Вместо этого система формирует среду, в которой каждый участник одновременно выступает наставником и учеником, а валютой взаимодействия становится экспертиза, время и готовность делиться опытом.

Созданный прототип доказывает технологическую и социальную жизнеспособность концепции цифрового бартера знаний и закладывает фундамент для развития доступных, человеко-ориентированных образовательных платформ нового поколения, способных трансформировать традиционные модели обучения в открытые, самоподдерживающиеся сети взаимного развития.

Технически проект состоит из трёх сервисов:

- **auth_service** — gRPC-сервис авторизации: регистрация, вход, выпуск и проверка JWT, отзыв токенов;
- **backend** — REST API на Gin: обмены навыками, их описания, профили. Запросы авторизации проксирует в auth_service по gRPC;
- **frontend** — SPA на React + TypeScript.

Оба Go-сервиса работают с общей базой PostgreSQL. Схему создают миграции бэкенда при его запуске.

## Архитектура и стек технологий

```
                 REST /api/v1                    gRPC
 frontend  ───────────────────►  backend  ──────────────────►  auth_service
 (React, :5173)                  (Gin, :8080)                  (gRPC, :50051)
                                      │                              │
                                      └──────────► PostgreSQL ◄──────┘
                                                   (:5432)
```

### Сервисы

**auth_service** — сервис авторизации (gRPC-сервер):

- контракт описан в [`proto/auth.proto`](proto/auth.proto): `Register`, `Login`, `ValidateToken`, `RefreshToken`, `Logout`;
- пароли хешируются bcrypt;
- JWT подписываются HS256: access-токен живёт 15 минут, refresh-токен — 7 дней, у каждого свой секрет;
- отозванные при `Logout` токены хранятся в памяти процесса (blacklist).

**backend** — основной REST API (gRPC-клиент auth_service):

- регистрацию и вход проксирует в auth_service и кладёт access-токен в HttpOnly-cookie `auth_token`;
- `AuthMiddleware` сначала проверяет JWT локально, без сетевого запроса, а при неудаче спрашивает auth_service (`ValidateToken`);
- `RequireRole` ограничивает доступ по роли;
- `RequestIDMiddleware` присваивает каждому запросу `X-Request-ID`, который возвращается в ответе и в поле `request_id`;
- при старте применяет миграции из `backend/migrations`;
- отдаёт Swagger UI и старую HTML-страницу (`backend/sheets`, `backend/func`).

**frontend** — SPA на React: лента обменов с фильтрами, создание обмена с предпросмотром, профиль, история и статистика.

### Слои Go-сервисов

Оба сервиса построены по одной схеме: транспорт → данные.

| Слой | backend | auth_service |
|---|---|---|
| Точка входа и DI | `cmd/main.go` | `cmd/server/main.go` |
| Транспорт | `internal/handler` — HTTP-обработчики Gin и middleware | `internal/handler` — реализация gRPC-сервера |
| Данные | `internal/repository` — SQL-запросы к PostgreSQL | `internal/repository` — SQL-запросы к PostgreSQL |
| Модели | `internal/models` | `internal/models` |
| Общие пакеты | `pkg/db` (миграции), `pkg/repo` (список категорий) | `pkg/jwt` (выпуск и проверка токенов) |

Внутри `handler` и `repository` код разбит по сущностям (`user`, `skills`), по одному файлу на операцию.

### Стек

**Backend и auth_service**

- Язык: Go 1.25
- База данных: PostgreSQL 15
- Межсервисное взаимодействие: gRPC + Protocol Buffers
- Контейнеризация: Docker, Docker Compose

**Ключевые Go-библиотеки**

- `gin-gonic/gin` — HTTP-роутинг и middleware (backend)
- `google.golang.org/grpc`, `google.golang.org/protobuf` — gRPC-сервер и клиент
- `golang-jwt/jwt/v5` — JWT
- `golang.org/x/crypto/bcrypt` — хеширование паролей (auth_service)
- `lib/pq` — драйвер PostgreSQL (backend)
- `jackc/pgx/v5` — драйвер PostgreSQL (auth_service)
- `golang-migrate/migrate/v4` — миграции схемы БД
- `swaggo/swag`, `swaggo/gin-swagger` — генерация и отдача Swagger-документации
- `google/uuid` — идентификаторы пользователей и `X-Request-ID`

**Frontend**

- React 19, TypeScript 6, Vite 8
- Redux Toolkit + React Redux — состояние приложения
- React Router 7 — маршрутизация, лоадеры для защищённых страниц
- Axios — HTTP-клиент
- Recharts — графики на странице статистики
- SCSS Modules — стили
- ESLint, Stylelint, Prettier — линтинг и форматирование

## Ключевые реализованные фичи

- Выделенный сервис авторизации, с которым бэкенд общается по gRPC.
- JWT с раздельными access- и refresh-токенами и раздельными секретами.
- Access-токен хранится в HttpOnly-cookie (`SameSite=Strict`), поэтому недоступен JavaScript.
- Двухступенчатая проверка токена: быстрая локальная проверка JWT и при необходимости запрос в auth_service.
- Ролевой доступ (`manager`, `admin`, `viewer`) через middleware `RequireRole`.
- Сквозной `X-Request-ID` для трассировки запросов.
- Единый формат ответа API (`ResponseApi`).
- Обмены навыками по пяти категориям, поиск по вхождению строки, подробные описания с upsert.
- Версионирование схемы БД миграциями, которые применяются автоматически при старте бэкенда.
- Swagger-документация API.
- Запуск всего проекта одной командой через Docker Compose (с healthcheck базы).

## Инструкция по установке и запуску

### Требования

- Docker и Docker Compose — для запуска всего проекта;
- для локальной разработки без Docker: Go 1.25+, Node.js 22+, PostgreSQL 15;
- для перегенерации кода: `swag`, `protoc`, `protoc-gen-go`, `protoc-gen-go-grpc`.

### Быстрый старт с Docker Compose

1. Создайте `.env` в корне проекта на основе `.env.example` и задайте секреты JWT (не короче 32 случайных символов):

   ```bash
   cp .env.example .env
   ```

   ```env
   JWT_ACCESS_SECRET=<случайная строка>
   JWT_REFRESH_SECRET=<другая случайная строка>
   ```

   Docker Compose читает из `.env` только эти две переменные. Параметры базы сейчас заданы прямо в `docker-compose.yml` (`user` / `pass` / `trade_db`).

2. Соберите и запустите контейнеры:

   ```bash
   docker compose up --build
   ```

3. После запуска доступны:

   | Что | Адрес |
   |---|---|
   | Frontend (React) | http://localhost:5173 |
   | Backend REST API | http://localhost:8080/api/v1 |
   | Swagger UI | http://localhost:8080/swagger/index.html |
   | Старая HTML-страница | http://localhost:8080/ |
   | auth_service (gRPC) | localhost:50051 |
   | PostgreSQL | localhost:5432, база `trade_db`, пользователь `user` / `pass` |

Остановить контейнеры можно командой `docker compose down`. Если нужно ещё и удалить данные базы, добавьте флаг `-v`.

### Локальный запуск без Docker

Каждую команду запускайте в отдельном терминале. Сначала нужна PostgreSQL с базой `trade_db`.

**auth_service**

```bash
cd auth_service
export DATABASE_URL="postgres://user:pass@localhost:5432/trade_db?sslmode=disable"
export JWT_ACCESS_SECRET=<секрет> JWT_REFRESH_SECRET=<секрет>
go run ./cmd/server
```

**backend** — запускайте из каталога `backend`: миграции, шаблоны и статика ищутся по относительным путям.

```bash
cd backend
export DATABASE_URL="postgres://user:pass@localhost:5432/trade_db?sslmode=disable"
export AUTH_SERVICE_ADDR=localhost:50051
export JWT_SECRET=<тот же секрет, что JWT_ACCESS_SECRET>
go run ./cmd
```

**frontend**

```bash
cd frontend
npm install
npm run dev
```

> auth_service не применяет миграции сам: таблицу `users` создаёт бэкенд при первом запуске. Поэтому после создания пустой базы бэкенд нужно запустить хотя бы один раз.

### Переменные окружения

| Переменная | Сервис | По умолчанию | Назначение |
|---|---|---|---|
| `DATABASE_URL` | backend, auth_service | `postgres://user:pass@localhost:5432/trade_db?sslmode=disable` (backend), `...@db:5432/...` (auth_service) | Подключение к PostgreSQL |
| `JWT_ACCESS_SECRET` | auth_service | — (обязательна, иначе сервис не стартует) | Секрет подписи access-токенов |
| `JWT_REFRESH_SECRET` | auth_service | — (обязательна) | Секрет подписи refresh-токенов |
| `GRPC_PORT` | auth_service | `50051` | Порт gRPC-сервера |
| `AUTH_SERVICE_ADDR` | backend | `auth:50051` | Адрес auth_service |
| `JWT_SECRET` | backend | — | Должен совпадать с `JWT_ACCESS_SECRET`; нужен для локальной проверки токенов в middleware |
| `VITE_API_URL` | frontend | `http://localhost:5000/api/v1/` | Базовый URL API |

### Полезные команды

```bash
# Перегенерировать Swagger после изменения аннотаций обработчиков
cd backend && swag init -d ./cmd,internal -o ./docs

# Перегенерировать gRPC-код после изменения proto/auth.proto (для обоих сервисов)
protoc -I proto \
  --go_out=backend/proto/auth --go_opt=paths=source_relative \
  --go-grpc_out=backend/proto/auth --go-grpc_opt=paths=source_relative \
  auth.proto
protoc -I proto \
  --go_out=auth_service/proto/auth --go_opt=paths=source_relative \
  --go-grpc_out=auth_service/proto/auth --go-grpc_opt=paths=source_relative \
  auth.proto

# Проверки Go-кода
(cd backend && go build ./... && go vet ./...)
(cd auth_service && go build ./... && go vet ./...)

# Сборка и линтинг фронтенда
cd frontend
npm run build        # tsc -b && vite build
npm run lint:all     # ESLint + Stylelint
npm run lint:all:fix # то же с автоисправлением
```

## API

Базовый путь: `/api/v1`. Полное описание с примерами есть в Swagger UI.

Все ответы приходят в едином формате:

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": true,
  "message": "Информационное сообщение",
  "error": "текст ошибки (только при status=false)",
  "result": {}
}
```

Защищённые маршруты требуют cookie `auth_token`, которую выставляет `POST /login`.

### Публичные

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/register` | Регистрация: `{username, email, password, role}`, где `role` — одно из `manager`, `admin`, `viewer` |
| `POST` | `/login` | Вход по `{username, password}`, ставит cookie `auth_token` |
| `GET` | `/skills` | Все обмены |
| `GET` | `/skills/:category` | Обмены категории |
| `GET` | `/skills/filter/:search` | Поиск по вхождению строки в навык, обмен, описание, автора и категорию |

### Для авторизованных пользователей

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/skills` | Создать обмен: `{username, skill, exchange, category}` |
| `POST` | `/skills/with-desc` | Создать обмен сразу с описанием и контактом |
| `DELETE` | `/skills/:id` | Удалить обмен |
| `GET` | `/skills/desc` | Все описания обменов |
| `GET` | `/skills/desc/:id` | Описание обмена по `skill_id` |
| `POST` | `/skills/desc` | Создать или обновить описание: `{skill_id, description, media}` |
| `GET` | `/users/me` | Свой профиль |
| `GET` | `/users/me/static` | Своя статистика |
| `GET` | `/users/profile/:username` | Профиль пользователя по никнейму |

### Только для роли `admin`

| Метод | Путь | Описание |
|---|---|---|
| `PUT` | `/users/:id` | Изменить пользователя |
| `DELETE` | `/users/:id` | Удалить пользователя |

### Категории обменов

Коды категорий заданы в [`backend/pkg/repo/categoryList.go`](backend/pkg/repo/categoryList.go):

| Код | Категория на фронтенде |
|---|---|
| `communicate` | Языки и коммуникация |
| `it` | Технологии и IT |
| `art` | Творчество и дизайн |
| `knowledge` | Наука, бизнес и саморазвитие |
| `hobby` | Хобби, здоровье и образ жизни |

## База данных

Миграции лежат в [`backend/migrations`](backend/migrations) и применяются по порядку при старте бэкенда:

| Миграция | Что делает |
|---|---|
| `000001_init_schema` | Таблицы `users` и `skills` |
| `000002_init_schema` | Таблица `skill_descriptions` |
| `000003_init_schema` | Пересоздаёт `skill_descriptions` с уникальным `skill_id` (одно описание на обмен) |
| `000004_init_schema` | Колонка `skill_descriptions.media` |
| `000005_added_column_skills` | Колонка `skills.category` |
| `000006_added_column_users` | Колонка `users.role` (по умолчанию `manager`) и индексы по `username` и `email` |

Основные таблицы:

- `users` — `id` (UUID), `username`, `email` (уникальный), `password` (bcrypt-хеш), `first_name`, `last_name`, `social_link`, `role`, `created_at`;
- `skills` — `id`, `username` (автор), `skill` (чему научит), `exchange` (что хочет взамен), `category`, `created_at`;
- `skill_descriptions` — `id`, `skill_id` (FK на `skills`, `ON DELETE CASCADE`), `description`, `media`, `created_at`.

## Структура проекта

```
Trade-y-exp/
├── docker-compose.yml           # db (PostgreSQL) + auth + app (backend) + frontend
├── .env.example                 # Шаблон переменных окружения
├── proto/
│   └── auth.proto               # Общий gRPC-контракт AuthService
│
├── auth_service/                # Сервис авторизации (gRPC-сервер)
│   ├── cmd/server/main.go       # Точка входа: подключение к БД, запуск gRPC
│   ├── internal/
│   │   ├── handler/
│   │   │   ├── handler.go       # Сборка обработчиков
│   │   │   └── user/            # Register, Login, Logout, RefreshToken, ValidateToken
│   │   ├── repository/
│   │   │   ├── repository.go
│   │   │   └── user/            # CreateUser, GetUserByUsername, GetUserByID
│   │   └── models/user.go       # User, TokenClaims
│   ├── pkg/jwt/token.go         # Выпуск и проверка JWT (HS256)
│   ├── proto/auth/              # Сгенерированный gRPC-код
│   └── Dockerfile
│
├── backend/                     # Основной REST API (Gin + gRPC-клиент)
│   ├── cmd/main.go              # Точка входа: БД, миграции, gRPC-клиент, маршруты
│   ├── internal/
│   │   ├── contextkeys/         # Ключи контекста запроса
│   │   ├── handler/
│   │   │   ├── handler.go       # Сборка обработчиков User + Skills
│   │   │   ├── middleware.go    # AuthMiddleware, RequireRole, RequestIDMiddleware
│   │   │   ├── user/            # Регистрация, вход, профили, админские операции
│   │   │   └── skills/          # Обмены и их описания
│   │   ├── repository/
│   │   │   ├── repository.go
│   │   │   ├── user/            # SQL-запросы по пользователям
│   │   │   └── skills/          # SQL-запросы по обменам и описаниям
│   │   └── models/              # User, Skill, SkillDescription, ResponseApi
│   ├── pkg/
│   │   ├── db/migrations.go     # Применение миграций golang-migrate
│   │   └── repo/categoryList.go # Допустимые категории обменов
│   ├── migrations/              # SQL-миграции
│   ├── docs/                    # Сгенерированная Swagger-документация
│   ├── proto/auth/              # Сгенерированный gRPC-код
│   ├── sheets/, func/           # Старая HTML-страница (шаблоны, JS, CSS)
│   └── Dockerfile
│
└── frontend/                    # React + TypeScript + Vite
    ├── src/
    │   ├── api/                 # Axios-клиент и методы API
    │   ├── pages/               # Main, Login, Register, Profile, Creator, History, Stats
    │   ├── components/          # Карточки обменов, фильтр, модалки, шапка, график
    │   ├── layouts/             # Root, General, Profile, Auth
    │   ├── ui/                  # Базовые UI-компоненты и SVG-иконки
    │   ├── store/               # Redux Toolkit: app, profile, skill
    │   ├── router/              # Маршруты и лоадеры доступа
    │   ├── constants/, types/, utils/, hooks/
    │   ├── mock/                # Тестовые данные обменов
    │   └── assets/              # Шрифты, стили, изображения
    ├── vite.config.ts           # Алиас @ и прокси /api → :8080
    └── Dockerfile
```

### Страницы фронтенда

| Путь | Страница | Доступ |
|---|---|---|
| `/` | Лента обменов с фильтром по категориям и поиском | все |
| `/login`, `/register` | Вход и регистрация | только гости |
| `/profile` | Профиль с редактированием | авторизованные |
| `/profile/history` | История своих обменов (активные и завершённые) | авторизованные |
| `/profile/stats` | Статистика | авторизованные |
| `/create` | Создание обмена с предпросмотром | авторизованные |
| `/profile/view/:profileId` | Чужой профиль | авторизованные |

## Текущее состояние и известные ограничения

Проект — прототип, часть функций ещё в работе:

- **Фронтенд пока не подключён к бэкенду.** Лента и история берутся из `frontend/src/mock/skills.ts`, профиль в store захардкожен. Пути, формат ответа и способ авторизации у фронта (`auth/*`, `response.data.data`, `Bearer` из `localStorage`) не совпадают с API бэкенда. Связка ведётся в отдельной ветке.
- Страницы `/profile` и `/profile/view/:profileId`, а также кнопка «Принять обмен» — заглушки. Статистика на графике демонстрационная.
- Blacklist отозванных токенов хранится в памяти auth_service и очищается при перезапуске.
- Автотестов пока нет.
- Учётные данные PostgreSQL заданы прямо в `docker-compose.yml`. Для продакшена их нужно вынести в `.env`, а cookie ставить с флагом `Secure` (сейчас `Secure: false`).
