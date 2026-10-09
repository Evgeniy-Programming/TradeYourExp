# Review: ветка `sync_frontend`

Полный список изменений в ветке `sync_frontend` относительно `develop`.

- **База:** `788b00a` (`fix style of auth service`). Содержимое `develop` (`9514eb9`) с ней совпадает, поэтому всё ниже — это и разница с `develop`.
- **Коммит:** `756d291 Sync frontend with backend API`.
- **Объём:** 74 файла, +2882 / −1716 строк. Из них около 2000 строк приходится на перегенерированный Swagger (`backend/docs/*`).

> Файл `Review.md` подпадает под правило `*.md` в `.gitignore`, поэтому Git его не видит. Чтобы закоммитить, нужен `git add -f Review.md`.

## Содержание

1. [Зачем понадобились изменения](#1-зачем-понадобились-изменения)
2. [Как теперь устроена связка](#2-как-теперь-устроена-связка)
3. [API: было → стало](#3-api-было--стало)
4. [База данных](#4-база-данных)
5. [Backend — по файлам](#5-backend--по-файлам)
6. [auth_service — по файлам](#6-auth_service--по-файлам)
7. [Frontend — по файлам](#7-frontend--по-файлам)
8. [Конфигурация и Docker](#8-конфигурация-и-docker)
9. [Структура до и после](#9-структура-до-и-после)
10. [Изменения поведения, которые легко пропустить](#10-изменения-поведения-которые-легко-пропустить)
11. [Как проверялось](#11-как-проверялось)
12. [Что не сделано](#12-что-не-сделано)

---

## 1. Зачем понадобились изменения

До ветки фронтенд и бэкенд не могли работать вместе:

| Проблема | Где |
|---|---|
| Фронт вызывал `auth/login`, `auth/register`, `auth/me`, `auth/refresh`, `auth/logout`, `auth/changepassword`, `auth/update`, `auth/profile/:id`, а бэкенд обслуживал `/login`, `/register`, `/users/me` | `frontend/src/api/auth.ts`, `backend/cmd/main.go` |
| Фронт отправлял `Authorization: Bearer` из `localStorage`, а бэкенд читал только cookie `auth_token` | `frontend/src/api/index.ts`, `backend/internal/handler/middleware.go` |
| Фронт читал `response.data.data`, а бэкенд отдавал `result` | там же |
| `VITE_API_URL=http://localhost:8080` без `/api/v1` и на другом origin, запасное значение указывало на порт `5000` | `docker-compose.yml`, `frontend/src/constants/api.tsx` |
| Фронт отправлял категорию названием («Технологии и IT»), бэкенд ждал код (`it`) — создание обмена всегда давало 500 | `frontend/src/constants/categories.ts`, `backend/pkg/repo/categoryList.go` |
| Регистрация требовала поле `role`, которое фронт не отправляет, — всегда 400 | `backend/internal/handler/user/RegisterUser.go` |
| Профиль и лента на фронте были моками, `requireAuth` всегда пропускал | `frontend/src/store/slices/*.ts`, `frontend/src/mock/skills.ts` |
| Refresh-токен проверялся ключом access-токена и не проходил никогда | `auth_service/internal/handler/user/RefreshToken.go` |
| Админские маршруты всегда отвечали 403: роль клалась в контекст по ключу `ContextKey("role")`, а читалась по строке `"role"` | `backend/internal/handler/middleware.go` |

---

## 2. Как теперь устроена связка

```
Браузер ──► Vite :5173 ──(прокси /api)──► backend :8080 ──gRPC──► auth_service :50051
               │                              │                         │
               └─ отдаёт React-приложение     └──────── PostgreSQL ─────┘
```

- **Один origin.** Фронт обращается к `/api/v1/...` на своём же адресе, Vite пересылает запросы на бэкенд. Поэтому cookie работают без CORS и без `SameSite=None`.
- **Токены в HttpOnly-cookie, которые ставит бэкенд:**
  - `auth_token` — access-токен, `Path=/`, живёт 15 минут;
  - `refresh_token` — refresh-токен, `Path=/api/v1/auth`, живёт 7 дней. Браузер отправляет его только на ручки авторизации.
- **Продление сессии.** Если запрос получает 401, фронт один раз вызывает `POST auth/refresh` и повторяет запрос. Одновременные 401 используют один общий refresh. На `auth/login`, `auth/register`, `auth/refresh` и `auth/logout` повтора нет.
- **Профиль при старте.** Лоадер корневого маршрута один раз вызывает `GET auth/me`. Гость при этом не считается ошибкой: профиль остаётся `null`.
- **Формат ответа не менялся:** `ResponseApi { request_id, status, message, result }`. Фронт достаёт `result` хелпером `unwrap`. Поле `error` с текстом внутренней ошибки новые ручки больше не заполняют: причина пишется в лог, клиенту уходит только `message`.

---

## 3. API: было → стало

Все пути указаны относительно `/api/v1`.

### Авторизация и профиль

| Было | Стало | Доступ | Примечание |
|---|---|---|---|
| `POST /register` | `POST /auth/register` | публичный | Тело `{username, email, password, firstName?, lastName?, link?}`. Роль назначает сервер (`manager`), поле `role` не нужно |
| `POST /login` | `POST /auth/login` | публичный | Тело `{type: "email"\|"username", login, password}`. Вход по никнейму **или** email. Ставит обе cookie, возвращает профиль |
| — | `POST /auth/refresh` | refresh-cookie | Новая пара токенов |
| — | `POST /auth/logout` | публичный | Отзывает access-токен в auth_service и удаляет cookie |
| `GET /users/me` | `GET /auth/me` | авторизованный | Профиль в формате фронта `IProfile` |
| — | `PUT /auth/update` | авторизованный | Частичное обновление профиля. При смене никнейма обмены переходят на новый |
| — | `POST /auth/changepassword` | авторизованный | `{currentPassword, newPassword}`. Неверный текущий пароль даёт 400, а не 401, чтобы фронт не принял это за истёкшую сессию |
| `GET /users/profile/:username` | `GET /auth/profile/:username` | авторизованный | Публичный профиль, **без email** |
| `GET /users/me/static` | `GET /skills/my/stats` | авторизованный | Раньше просто копировал `/users/me`, теперь возвращает настоящую статистику |

### Обмены (skills)

| Было | Стало | Доступ | Примечание |
|---|---|---|---|
| `GET /skills` | `GET /skills?category=&search=&searchIn=` | публичный | `category` — код категории; `searchIn`: `skill`, `exchange` или пусто (поиск по всем полям). Пустой результат — `200 []`, а не 404 |
| `GET /skills/:category` | без изменений | публичный | Теперь отдаёт тот же формат карточек `SkillCard` |
| `GET /skills/filter/:search` | без изменений | публичный | То же |
| `POST /skills` | `POST /skills` | авторизованный | Новое тело: `{category, skill, exchange, description, contactType, contactValue}`. Автор берётся из сессии, а не из тела. Описание сохраняется в той же транзакции |
| `POST /skills/with-desc` | **удалён** | — | Объединён с `POST /skills` (раньше всегда падал: не передавалась категория) |
| — | `GET /skills/my` | авторизованный | Обмены текущего пользователя (страница «История») |
| — | `GET /skills/my/stats` | авторизованный | `{total, active, closed, byMonth: [{month: "YYYY-MM", count}]}` за 12 месяцев |
| `DELETE /skills/:id` | без изменений | авторизованный | Удалить можно **только свой** обмен; чужой или несуществующий даёт 404, ответ 200 вместо 201 |
| `GET /skills/desc`, `GET /skills/desc/:id`, `POST /skills/desc` | без изменений | авторизованный | В `GET /skills/desc/:id` исправлена паника на `id <= 0` |

### Администрирование

| Маршрут | Изменение |
|---|---|
| `PUT /users/:id`, `DELETE /users/:id` | Код не менялся, но маршруты впервые стали доступны роли `admin`: раньше `RequireRole` отвечал 403 всем |

### Формат карточки обмена (`SkillCard`)

```json
{
  "id": "1",
  "category": "it",
  "description": "Научу писать API",
  "skill": "Go",
  "exchange": "Английский",
  "contactType": "telegram",
  "contactValue": "alice_tg",
  "username": "alice",
  "avatarUsername": null,
  "createdAt": "2026-09-30T05:57:06.894728Z",
  "status": "ACTIVE"
}
```

`id` передаётся строкой (`json:"id,string"`), потому что на фронте `ISkill.id: string`.

### Формат профиля (`Profile`)

```json
{
  "id": "uuid",
  "username": "alice",
  "email": "alice@mail.ru",
  "firstName": "Алиса",
  "lastName": null,
  "link": "https://t.me/alice",
  "createdAt": "2026-09-30T05:57:06.356302Z"
}
```

---

## 4. База данных

Новая миграция `backend/migrations/000007_sync_frontend.up.sql`:

```sql
ALTER TABLE skills ADD COLUMN IF NOT EXISTS contact_type TEXT NOT NULL DEFAULT 'site';
ALTER TABLE skills ADD COLUMN IF NOT EXISTS contact_value TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_skills_username ON skills(username);
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON users(username);
```

- `contact_type` / `contact_value` — способ связи из формы создания обмена. Раньше они склеивались строкой в `skill_descriptions.media`.
- `status` — `ACTIVE` / `CLOSED` для страницы «История».
- Уникальный `username`. Вход идёт по никнейму, а раньше в базе могли оказаться два пользователя с одним именем.

> ⚠️ Если в существующей базе уже есть повторяющиеся `username`, миграция упадёт, а вместе с ней бэкенд (`log.Fatal`). Дубликаты нужно убрать до запуска.

Файла `down` для этой миграции нет, как и для предыдущих.

---

## 5. Backend — по файлам

### Новые файлы

| Файл | Что делает |
|---|---|
| `internal/handler/auth/Auth.go` | `auth.Handler` (repo + gRPC-клиент), константы cookie, `setAuthCookies` / `clearAuthCookies`, таймаут gRPC 5 секунд. Флаг `Secure` берётся из `COOKIE_SECURE` |
| `internal/handler/auth/Register.go` | Регистрация через gRPC с ролью `manager`. Затем `SetProfileDetails` (имя, фамилия, ссылка) и ответ с профилем. `AlreadyExists` → 409 |
| `internal/handler/auth/Login.go` | Определяет тип логина (email/никнейм); для email находит `username` через `GetUsernameByEmail`, потому что auth_service логинит только по никнейму. Затем gRPC `Login`, cookie, профиль |
| `internal/handler/auth/Session.go` | `Refresh` (по cookie `refresh_token`) и `Logout` (отзыв токена + удаление cookie, даже если gRPC недоступен) |
| `internal/handler/auth/Profile.go` | `Me`, `Update`, `ChangePassword` (bcrypt прямо в бэкенде), `GetProfile` (без email) |
| `internal/handler/respond/respond.go` | Хелперы `respond.OK` и `respond.Error`. `Error` логирует внутреннюю ошибку с `request_id` и не отдаёт её клиенту |
| `internal/models/profile.go` | `Profile`, `ProfileUpdate`, `AuthRegisterRequest`, `AuthLoginRequest`, `ChangePasswordRequest` |
| `internal/repository/user/Password.go` | `GetPasswordHash`, `UpdatePasswordHash` |
| `internal/repository/user/UpdateProfile.go` | `SetProfileDetails`; `UpdateProfile` в транзакции: `COALESCE` для частичного обновления, перенос `skills.username` при смене никнейма, код `23505` → `ErrUserExists` |
| `migrations/000007_sync_frontend.up.sql` | См. раздел 4 |

### Изменённые файлы

| Файл | Изменение |
|---|---|
| `cmd/main.go` | Добавлены группа `/auth` и маршруты `/skills/my`, `/skills/my/stats`. Убраны `/login`, `/register`, `/users/me*`, `/users/profile/:username`, `/skills/with-desc`. Добавлен `db.Ping()` перед миграциями. Middleware авторизации создаётся один раз и получает общий gRPC-клиент. CORS-origin читается из `CORS_ORIGIN` (по умолчанию `http://localhost:5173`), в `Allow-Headers` добавлен `X-Request-ID`. Заголовок Swagger сменён с «Swagger Example API» на «Trade Your Exp API» |
| `internal/handler/middleware.go` | `AuthMiddleware(cfg, authClient)` больше не создаёт своё gRPC-соединение на каждый вызов. Удалены неиспользуемые `PublicPaths`, `AuthServiceAddr`, константы `ContextUserID/...` и `GetRequestID`. Проверка `user_id` в claims без паники на type assertion. Таймаут на gRPC. **`RequireRole` теперь читает роль по `contextkeys.RoleKey`** — это исправляет 403 на админских маршрутах |
| `internal/handler/handler.go` | Добавлен `Auth *auth.Handler`. Удалены неиспользуемые интерфейсы `SkillsHandler` и `UserHandler` |
| `internal/contextkeys/keys.go` | Добавлен хелпер `String(c, key)` для чтения строки из контекста gin |
| `internal/handler/skills/Skills.go` | Хелпер `currentUsername`: никнейм берётся из БД по `user_id`, потому что в JWT он может устареть после смены в профиле |
| `internal/handler/skills/GetSkills.go` | Все списки идут через `listSkills` → `ListSkills`. Добавлены `GetMySkills` и `GetMyStats`, валидация `searchIn`. Неизвестная категория → 400 (было 500) |
| `internal/handler/skills/AddSkills.go` | Один `CreateSkill` вместо `CreateSkill` + `CreateSkillWithDesc`. Валидация полей и контакта, автор из сессии |
| `internal/handler/skills/DeleteSkills.go` | Удаление с проверкой владельца, `id` парсится как число. 404 при отсутствии, 200 при успехе |
| `internal/handler/skills/GetDescription.go` | Убрано `err.Error()` при `err == nil` (была паника на `GET /skills/desc/0`) |
| `internal/handler/user/User.go` | Пакет `user` оставлен только для админских `UpdateUser` / `DeleteUser`. Убран неиспользуемый `authClient` |
| `internal/models/skill.go` | Добавлены `SkillCard`, `SkillCreateRequest`, `SkillFilter`, `SkillStats`, `SkillStatsMonth`. Удалены неиспользуемые `Skill`, `SkillFull`, `TestStruct` |
| `internal/models/user.go` | Удалены неиспользуемые `ProfileRequest`, `LoginRequest`, `RegisterRequest`, `AuthResponse`; `User` остался для админского `UpdateUser` |
| `internal/repository/repository.go` | Удалены неиспользуемые интерфейсы с неверными именами методов (`FetchSkills`, `GetSkilllByCategory`) и незаполняемое поле `DB` |
| `internal/repository/skills/AddSkills.go` | `SaveSkill` → `CreateSkill(ctx, username, req)` с транзакцией (skill + description). Ошибка `ErrInvalidCategory`. `UpsertDescription` не изменился |
| `internal/repository/skills/GetSkills.go` | `GetAllSkills`, `GetSkillsByCategory`, `GetSkillByFilters` заменены одним `ListSkills(filter)` с параметризованным `WHERE` и экранированием `ILIKE`. Раньше `GetAllSkills` молча пропускал ошибки `Scan`. Добавлен `GetStats` (`generate_series` по месяцам). Функции для описаний не менялись |
| `internal/repository/skills/DeleteSkills.go` | `DeleteSkill(ctx, id, username)` с условием `AND username = $2` |
| `internal/repository/user/User.go` | Ошибки `ErrNotFound` и `ErrUserExists` |
| `internal/repository/user/GetProfile.go` | `GetMyProfile`, `GetProfile`, `GetMyProfileStatic` заменены на `GetProfileByID` и `GetProfileByUsername`, возвращающие `models.Profile` |
| `internal/repository/user/GetUser.go` | `GetByEmail` заменён на `GetUsernameByEmail` (без учёта регистра). Старый падал на `NULL` в `first_name` |
| `go.mod` | `golang.org/x/crypto` из indirect стал прямой зависимостью (bcrypt). Версии не менялись |
| `docs/docs.go`, `docs/swagger.json`, `docs/swagger.yaml` | Перегенерированы `swag init -d ./cmd,internal -o ./docs` под новые ручки |

### Удалённые файлы

| Файл | Причина |
|---|---|
| `internal/handler/user/LoginUser.go` | Заменён на `handler/auth/Login.go` |
| `internal/handler/user/RegisterUser.go` | Заменён на `handler/auth/Register.go` |
| `internal/handler/user/GetProfile.go` | Заменён на `handler/auth/Profile.go` и `skills.GetMyStats` |
| `internal/repository/user/LoginUser.go` | Был пустым (`package user`) |
| `internal/repository/user/RegisterUser.go` | `CreateUser` в бэкенде нигде не вызывался: пользователей создаёт auth_service |

---

## 6. auth_service — по файлам

Proto-контракт (`proto/auth.proto`) и сгенерированный код **не менялись**.

| Файл | Изменение |
|---|---|
| `pkg/jwt/token.go` | Добавлен `ParseRefreshToken` (ключ `RefreshSecret`). Общий код вынесен в `parseToken(token, secret)` |
| `internal/handler/user/RefreshToken.go` | Использует `ParseRefreshToken` вместо `ParseAccessToken`. **Раньше refresh не работал никогда**, а вместо refresh-токена подходил access-токен |
| `internal/handler/user/User.go` | Удалены дубли `ErrUserNotFound` / `ErrUserExists`: из-за них `errors.Is` не находил совпадения с ошибками репозитория. Blacklist защищён `sync.RWMutex`, просроченные записи вычищаются в `revoke`. Добавлены методы `revoke` и `isRevoked` |
| `internal/handler/user/Logout.go` | `a.revoke(...)` вместо прямой записи в map: при параллельных logout была гонка и возможная паника `concurrent map writes` |
| `internal/handler/user/ValidateToken.go` | `a.isRevoked(...)` вместо чтения map без блокировки |
| `internal/handler/user/Login.go` | Сравнивает с `userrepo.ErrUserNotFound`. Раньше несуществующий пользователь получал `Internal` вместо `Unauthenticated` |
| `internal/handler/user/Register.go` | Сравнивает с `userrepo.ErrUserExists`. Пустая роль заменяется на `manager` |
| `internal/repository/user/CreateUser.go` | Дубликат определяется по `*pgconn.PgError` с кодом `23505`. Раньше сравнивалась строка `"pq: duplicate key..."`, хотя драйвер pgx, поэтому вместо 409 всегда был 500 |
| `internal/repository/user/GetUser.go` | `errors.Is(err, sql.ErrNoRows)` вместо `==` |

---

## 7. Frontend — по файлам

### Новые файлы

| Файл | Что делает |
|---|---|
| `src/types/api.ts` | `IApiResponse<T>` — формат ответа бэкенда |

### Изменённые файлы

| Файл | Изменение |
|---|---|
| `src/constants/api.tsx` | `baseURL` по умолчанию `'/api/v1/'` (было `'http://localhost:5000/api/v1/'`) |
| `src/constants/categories.ts` | Добавлен `categoryCodes`: название категории → код бэкенда (`it`, `communicate`, `art`, `knowledge`, `hobby`) |
| `src/api/index.ts` | Убраны `localStorage` и `Bearer`. Interceptor на 401 вызывает `auth/refresh` и повторяет запрос (кроме ручек входа, регистрации, refresh и logout), использует общий промис refresh. Если refresh не удался, отклоняется исходная ошибка. Добавлен `unwrap` |
| `src/api/auth.ts` | Все методы типизированы и возвращают `result`, пути не менялись. `getProfile` экранирует никнейм |
| `src/api/skill.ts` | Добавлены `getSkills(query)`, `getMySkills`, `getStats`, `deleteSkill`. Категории переводятся в коды и обратно, `contactValue` обнуляется для `site`. Тип поиска: `Получить` → `searchIn=skill`, `Обменять` → `searchIn=exchange` |
| `src/types/skill.ts` | Добавлены `ISkillQuery` и `ISkillStats` |
| `src/store/slices/profileSlice.ts` | Захардкоженный тестовый профиль заменён на `null`. Добавлены `isInitialized` и thunk `fetchProfile` (для гостя возвращает `null`, а не ошибку). `setProfile` выставляет `isInitialized` |
| `src/store/slices/skillSlice.ts` | Моки заменены пустыми массивами. Добавлены thunk `fetchSkills(query)` и `fetchHistorySkills`, флаг `isLoading` |
| `src/router/loaders/authLoader.tsx` | `ensureProfile` один раз загружает профиль (общий промис, потому что лоадеры родителя и потомка идут параллельно). Новый `loadProfile`; `requireAuth` и `requireGuest` ждут загрузки |
| `src/router/index.tsx` | Корневому маршруту назначен `loader: loadProfile` |
| `src/components/SkillFilter/SkillFilter.tsx` | Категория и тип поиска сразу перезагружают ленту, строка поиска применяется по кнопке «Найти». Ошибки показываются через `setErrorWithTimeout`. Раньше `searchSkill` была пустой функцией |
| `src/pages/MainPage/MainPage.tsx` | Убран `useProfile()`, добавлена надпись «Обменов не найдено» |
| `src/pages/HistoryPage/HistoryPage.tsx` | Убран `useProfile()`. Загрузка `fetchHistorySkills` при открытии, надпись «Сделок пока нет» |
| `src/pages/StatsPage/StatsPage.tsx` | Загрузка `skillAPI.getStats()`, строка с итогами, данные по месяцам в график |
| `src/components/AnalyticsChart/AnalyticsChart.tsx` | Данные приходят через проп `data` вместо захардкоженных «продаж». Подписи «Опубликованные обмены» / «Обменов: N». `TooltipProps` заменён на `TooltipContentProps` — этим исправлена ошибка типов recharts v3, из-за которой `npm run build` падал ещё до этой ветки |
| `src/pages/LoginPage/LoginPage.tsx` | Профиль из ответа логина сохраняется в store (`setProfile`) |
| `src/pages/CreatorPage/CreatorPage.tsx` | Убран `useProfile()`. После публикации переход на `/profile/history` (было `/profile`, где сейчас «Hello world») |
| `src/pages/ProfilePage/ProfilePage.tsx` | Убран `useProfile()` |
| `src/components/ProfileEdit/ProfileEdit.tsx` | Сохранение берёт профиль из ответа `auth/update` (раньше читался несуществующий `response.data.data`). Добавлена **кнопка «Выйти»** |
| `src/components/ChangePasswordModal/ChangePasswordModal.tsx` | Проверка совпадения нового пароля и повтора, вызов `auth/changepassword`. Раньше модалка просто закрывалась |
| `src/components/Header/Header.tsx` | В аватаре реальный никнейм вместо `"Username123"` |
| `vite.config.ts` | Цель прокси берётся из `API_PROXY_TARGET` (по умолчанию `http://localhost:8080`) |

### Удалённые файлы

| Файл | Причина |
|---|---|
| `src/hooks/useProfile.ts` | Профиль грузится лоадером роутера. Хук запрашивал его заново на каждой странице и показывал гостю ошибку 401 |
| `src/mock/skills.ts` | Данные идут из API |

---

## 8. Конфигурация и Docker

| Файл | Изменение |
|---|---|
| `docker-compose.yml` | У сервиса `frontend` `VITE_API_URL=http://localhost:8080` заменён на `API_PROXY_TARGET=http://app:8080`. Внутри контейнера `localhost` указывает на сам контейнер, поэтому бэкенд нужно искать по имени сервиса |
| `.env.example` | Добавлены `COOKIE_SECURE`, `CORS_ORIGIN`, `API_PROXY_TARGET`; `VITE_API_URL` теперь пустой по умолчанию |

Новые переменные окружения:

| Переменная | Сервис | По умолчанию | Назначение |
|---|---|---|---|
| `COOKIE_SECURE` | backend | `false` | `true` ставит флаг `Secure` на cookie (нужно при HTTPS) |
| `CORS_ORIGIN` | backend | `http://localhost:5173` | Нужен только при обращении к API напрямую, в обход прокси |
| `API_PROXY_TARGET` | frontend (Vite) | `http://localhost:8080` | Куда проксировать `/api` |
| `VITE_API_URL` | frontend | `/api/v1/` | Переопределяет базовый URL API; обычно не нужен |

---

## 9. Структура до и после

Показаны только каталоги, которые изменились. `+` — новый, `−` — удалён, `~` — изменён.

```
backend/
├── cmd/main.go                          ~
├── docs/{docs.go,swagger.json,swagger.yaml}  ~ (перегенерированы)
├── go.mod                               ~
├── migrations/
│   └── 000007_sync_frontend.up.sql      +
└── internal/
    ├── contextkeys/keys.go              ~
    ├── handler/
    │   ├── handler.go                   ~
    │   ├── middleware.go                ~
    │   ├── auth/                        + (новый пакет)
    │   │   ├── Auth.go                  +
    │   │   ├── Login.go                 +
    │   │   ├── Profile.go               +
    │   │   ├── Register.go              +
    │   │   └── Session.go               +
    │   ├── respond/respond.go           + (новый пакет)
    │   ├── skills/
    │   │   ├── AddSkills.go             ~
    │   │   ├── DeleteSkills.go          ~
    │   │   ├── GetDescription.go        ~
    │   │   ├── GetSkills.go             ~
    │   │   └── Skills.go                ~
    │   └── user/                        (только админские UpdateUser/DeleteUser)
    │       ├── GetProfile.go            −
    │       ├── LoginUser.go             −
    │       ├── RegisterUser.go          −
    │       └── User.go                  ~
    ├── models/
    │   ├── profile.go                   +
    │   ├── skill.go                     ~
    │   └── user.go                      ~
    └── repository/
        ├── repository.go                ~
        ├── skills/{AddSkills,DeleteSkills,GetSkills}.go  ~
        └── user/
            ├── GetProfile.go            ~
            ├── GetUser.go               ~
            ├── LoginUser.go             −
            ├── Password.go              +
            ├── RegisterUser.go          −
            ├── UpdateProfile.go         +
            └── User.go                  ~

auth_service/
├── pkg/jwt/token.go                     ~
└── internal/
    ├── handler/user/{Login,Logout,RefreshToken,Register,User,ValidateToken}.go  ~
    └── repository/user/{CreateUser,GetUser}.go  ~

frontend/
├── vite.config.ts                       ~
└── src/
    ├── api/{index,auth,skill}.ts        ~
    ├── components/
    │   ├── AnalyticsChart/AnalyticsChart.tsx            ~
    │   ├── ChangePasswordModal/ChangePasswordModal.tsx  ~
    │   ├── Header/Header.tsx                            ~
    │   ├── ProfileEdit/ProfileEdit.tsx                  ~
    │   └── SkillFilter/SkillFilter.tsx                  ~
    ├── constants/{api.tsx,categories.ts}  ~
    ├── hooks/useProfile.ts              −
    ├── mock/skills.ts                   −
    ├── pages/{Creator,History,Login,Main,Profile,Stats}Page/*.tsx  ~
    ├── router/{index.tsx,loaders/authLoader.tsx}  ~
    ├── store/slices/{profileSlice,skillSlice}.ts  ~
    └── types/
        ├── api.ts                       +
        └── skill.ts                     ~

docker-compose.yml                       ~
.env.example                             ~
```

**Как теперь разделены пакеты в backend/handler:**

| Пакет | Отвечает за |
|---|---|
| `handler/auth` | Всё, что видит пользователь про себя: регистрация, вход, сессия, профиль, пароль. Ходит в auth_service по gRPC |
| `handler/skills` | Обмены и описания |
| `handler/user` | Только админские операции над пользователями |
| `handler/respond` | Единый формат ответов и логирование ошибок |

---

## 10. Изменения поведения, которые легко пропустить

1. **Роль при регистрации больше не выбирает клиент.** Даже если отправить `"role":"admin"`, будет `manager`. Админа теперь можно назначить только вручную в БД.
2. **Старые ручки удалены:** `/login`, `/register`, `/users/me`, `/users/me/static`, `/users/profile/:username`, `/skills/with-desc`.
   ⚠️ **Старая HTML-страница бэкенда (`GET /` на `:8080`) в этой ветке сломана.** `backend/func/script.js` вызывает `/api/v1/register` (строка 266), `/api/v1/login` (строка 281) и `/api/v1/skills/with-desc` (строка 382). Её нужно либо перевести на `/api/v1/auth/*` и `POST /skills`, либо удалить, раз её заменил React-фронтенд. То же касается Postman-коллекций, если они есть.
3. **Изменилось тело `POST /skills`:** поля в camelCase (`contactType`, `contactValue`), добавлено `description`, автор из сессии. Поле `username` в теле игнорируется.
4. **Удалить можно только свой обмен.** Раньше любой авторизованный пользователь удалял любой.
5. **Пустая выборка — это `200 []`, а не 404.**
6. **Поле `error` в новых ответах не заполняется.** Подробности ищите в логах бэкенда по `request_id`.
7. **Смена никнейма** переносит на новое имя все записи `skills.username`.
8. **Публичный профиль скрывает email.**
9. **Logout:** после выхода cookie удаляются. Сам access-токен при этом заносится в blacklist auth_service, но быстрая локальная проверка JWT в middleware blacklist не смотрит, поэтому скопированный токен действует до истечения (15 минут). Это поведение было и раньше.
10. **Миграция 000007 падает при дубликатах `username`** (см. раздел 4).

---

## 11. Как проверялось

- `go build ./...` и `go vet ./...` — `backend` и `auth_service` без ошибок.
- `npm run build` (`tsc -b && vite build`), `eslint src`, `stylelint` — без ошибок. Остаётся только предупреждение Vite о размере бандла больше 500 КБ.
- Сквозная проверка в Docker (`docker compose up --build` на отдельном томе), все запросы через прокси Vite `:5173`, как из браузера:

| Сценарий | Результат |
|---|---|
| `GET auth/me` гостем | 401 |
| Регистрация / повторная регистрация | 201 / 409 |
| Вход с неверным паролем / по email | 401 / 200, обе cookie выставлены |
| Создание обмена с контактом telegram / «на сайте» / с неверной категорией | 201 / 201 / 400 |
| Лента, фильтр `category=it`, поиск `searchIn=skill`, поиск `searchIn=exchange` по кириллице | 200, корректные выборки |
| История, статистика | 200 |
| Смена никнейма → история | Обмены перешли на новый никнейм |
| Публичный профиль | 200, без email |
| Смена пароля с неверным / верным текущим | 400 / 200 |
| Нет access-cookie → `auth/me` → `auth/refresh` → `auth/me` | 401 → 200 → 200 |
| Logout → `auth/me` | 200 → 401 |
| Вход с новым паролем | 200 |
| Регистрация с `"role":"admin"` | Создан с ролью `manager` |
| Паники в логах бэкенда | Нет |

Автотестов в ветке нет, как не было и в проекте.

---

## 12. Что не сделано

На фронте для этого нет готового интерфейса или логики, поэтому оставлено как есть:

- Страница чужого профиля `/profile/view/:profileId` — по-прежнему заглушка. Ручка `GET auth/profile/:username` для неё уже работает.
- Кнопка «Принять обмен» и перевод обмена в статус `CLOSED`.
- `ProfilePage` («Hello world»).
- Старая HTML-страница бэкенда (`backend/sheets`, `backend/func`) не переведена на новые ручки (см. раздел 10, пункт 2).
- Загрузка аватара.
- `POST /skills/desc` не проверяет владельца обмена, а админский `PUT /users/:id` сохраняет пароль без хеширования. Это проблемы исходного кода, ветка их не затрагивала.
