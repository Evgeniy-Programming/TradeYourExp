# Review: ветка `sync_frontend`

Все изменения ветки `sync_frontend` относительно `develop`.

- **База:** `788b00a` (`fix style of auth service`). Содержимое `develop` (`9514eb9`) с ней совпадает.
- **Принцип:** бэкенд остаётся в исходной стилистике. Существующие ручки, пути, английские сообщения, формат `ResponseApi` (с полем `error`) и структура «одна операция — один файл» сохранены. Новое добавлено поверх в том же стиле. Чтобы фронтенд заработал с этим API, адаптирован сам фронтенд.

## Содержание

1. [Коротко](#1-коротко)
2. [Как работает связка](#2-как-работает-связка)
3. [API: что добавлено и что изменено](#3-api-что-добавлено-и-что-изменено)
4. [Backend — по файлам](#4-backend--по-файлам)
5. [auth_service — по файлам](#5-auth_service--по-файлам)
6. [Frontend — по файлам](#6-frontend--по-файлам)
7. [Конфигурация](#7-конфигурация)
8. [Что важно знать](#8-что-важно-знать)
9. [Как проверялось](#9-как-проверялось)

---

## 1. Коротко

| Часть | Что сделано |
|---|---|
| backend | 4 новые ручки: `POST /logout`, `POST /refresh`, `PUT /users/me`, `PUT /users/me/password`. Точечные доработки 5 существующих: регистрация, вход, профиль, лента обменов, создание обмена с описанием. Новых миграций нет |
| auth_service | Исправлены 3 бага: refresh-токен проверялся не тем ключом; ошибки «пользователь не найден / уже существует» не распознавались; гонка в blacklist при параллельных logout |
| frontend | Моки заменены запросами к API. Авторизация через HttpOnly-cookie с автоматическим refresh. Все страницы подключены к существующим ручкам бэкенда |
| Docker | Vite проксирует `/api` на бэкенд по имени сервиса `app` |

---

## 2. Как работает связка

```
Браузер ──► Vite :5173 ──(прокси /api)──► backend :8080 ──gRPC──► auth_service :50051
                                              │                         │
                                              └──────── PostgreSQL ─────┘
```

- **Один origin.** Фронт ходит на `/api/v1/...` своего адреса, Vite пересылает запрос на бэкенд. Поэтому cookie работают без CORS.
- **Cookie.** `POST /login` ставит две HttpOnly-cookie:
  - `auth_token` — access-токен, `Path=/`, 15 минут. Эта cookie была и раньше;
  - `refresh_token` — refresh-токен, `Path=/api/v1`, 7 дней. **Новая.**
- **Продление сессии.** На 401 фронт один раз вызывает `POST /refresh` и повторяет запрос. Для `login`, `register`, `refresh` и `logout` повтора нет.
- **Профиль.** Фронт загружает его один раз в лоадере роутера через `GET /users/me`. Гость при этом не считается ошибкой.
- **Формат ответа не менялся:** `{ request_id, status, error, message, result }`. Фронт берёт данные из `result`.

---

## 3. API: что добавлено и что изменено

Пути указаны относительно `/api/v1`. Существующие пути не переименовывались и не удалялись.

### Новые ручки

| Метод | Путь | Доступ | Файл | Описание |
|---|---|---|---|---|
| `POST` | `/logout` | публичный | `handler/user/LogoutUser.go` | Отзывает access-токен в auth_service (`Logout`) и удаляет обе cookie. Cookie удаляются, даже если auth_service ответил ошибкой |
| `POST` | `/refresh` | refresh-cookie | `handler/user/RefreshToken.go` | По `refresh_token` получает у auth_service (`RefreshToken`) новую пару токенов и ставит cookie. Нет cookie или токен недействителен — 401 |
| `PUT` | `/users/me` | авторизованный | `handler/user/UpdateProfile.go` | Обновляет **только непустые** поля `{username, email, firstName, lastName, socialLink}`. При смене `username` переносит на него записи `skills.username`. Занятый `username` — 409 `Username exists` |
| `PUT` | `/users/me/password` | авторизованный | `handler/user/ChangePassword.go` | `{currentPassword, newPassword}` (новый — от 6 символов). Неверный текущий пароль — **400**, а не 401, иначе фронт принял бы это за истёкшую сессию |

### Изменённые ручки

| Ручка | Было | Стало |
|---|---|---|
| `POST /register` | Обязательное поле `role` (`manager`/`admin`/`viewer`) — фронт его не отправляет, поэтому всегда 400. Кроме того, любой мог зарегистрироваться админом | `role` убран из запроса, сервер всегда передаёт в auth_service `manager`. Добавлены необязательные `firstName`, `lastName`, `socialLink`: auth_service их не хранит, поэтому после регистрации они дописываются в `users` |
| `POST /login` | Только по `username`, ставит одну cookie | Если в `username` передан email (есть `@`), бэкенд сначала находит по нему `username`. Ставит обе cookie. Тело ответа не менялось |
| `GET /users/me`, `GET /users/profile/:username` | `{username, email, socialLink, created_at}` | Добавлены поля `id`, `firstName`, `lastName` — они нужны форме профиля |
| `GET /skills`, `GET /skills/:category` | `[{id, username, skill, exchange, category}]` | Формат `SkillFull`, как у `/skills/filter/:search`: добавлены `description`, `media`, `created_at` через `LEFT JOIN skill_descriptions`. Старые поля на месте |
| `POST /skills/with-desc` | Категория не передавалась, `SaveSkill` отклонял пустую — ручка **всегда отвечала 500** | Добавлено поле `category` |

Остальные ручки не менялись: `GET /skills/filter/:search`, `POST /skills`, `DELETE /skills/:id`, `/skills/desc*`, `GET /users/me/static`, `PUT /users/:id`, `DELETE /users/:id`.

### Как фронт использует API

| Экран фронта | Ручки |
|---|---|
| Регистрация | `POST /register` |
| Вход | `POST /login` → `GET /users/me` |
| Загрузка профиля при старте | `GET /users/me` (при 401 — `POST /refresh` и повтор) |
| Профиль: сохранить | `PUT /users/me` → `GET /users/me` |
| Профиль: сменить пароль | `PUT /users/me/password` |
| Профиль: выйти | `POST /logout` |
| Лента без фильтров | `GET /skills` |
| Лента по категории | `GET /skills/:category` |
| Поиск (и поиск внутри категории) | `GET /skills/filter/:search`, категория фильтруется на клиенте |
| Тип поиска «Получить» / «Обменять» | Фильтр на клиенте по `skill` / `exchange` |
| Создание обмена | `POST /skills/with-desc` |
| История | `GET /skills`, отфильтрованный по `username` текущего пользователя |
| Статистика | То же, плюс подсчёт по месяцам на клиенте |

---

## 4. Backend — по файлам

### Новые файлы

| Файл | Содержимое |
|---|---|
| `internal/handler/user/Cookies.go` | Константы имён cookie, срок refresh-cookie, `defaultRole = "manager"`. Хелперы `setAuthCookies` (используется в `Login` и `RefreshToken`) и `clearAuthCookies` (в `Logout` и `RefreshToken`) |
| `internal/handler/user/LogoutUser.go` | `Logout` — `POST /logout` |
| `internal/handler/user/RefreshToken.go` | `RefreshToken` — `POST /refresh` |
| `internal/handler/user/UpdateProfile.go` | `UpdateMyProfile` — `PUT /users/me` |
| `internal/handler/user/ChangePassword.go` | `ChangePassword` — `PUT /users/me/password` (bcrypt) |
| `internal/repository/user/UpdateProfile.go` | `UpdateProfile(u, id)` в транзакции: проверка, что `username` свободен (`ErrUsernameTaken`), перенос `skills.username`, `UPDATE ... COALESCE(NULLIF($n, ''), поле)` |
| `internal/repository/user/Password.go` | `GetPasswordHash(id)`, `UpdatePassword(hash, id)` |

### Изменённые файлы

| Файл | Изменение |
|---|---|
| `cmd/main.go` | +4 маршрута: `v1.POST("/logout")`, `v1.POST("/refresh")`, `protected.PUT("users/me")`, `protected.PUT("users/me/password")` |
| `internal/handler/handler.go` | В интерфейс `UserHandler` добавлены 4 новых метода |
| `internal/handler/user/RegisterUser.go` | Вместо `role` — поля `firstName`, `lastName`, `socialLink`; роль `defaultRole`; после gRPC `Register` вызывается `UpdateProfile` |
| `internal/handler/user/LoginUser.go` | Вход по email через `GetUsernameByEmail`; установка cookie вынесена в `setAuthCookies` |
| `internal/handler/skills/AddSkills.go` | В `CreateSkillWithDesc` добавлено поле `category`. Аннотация `@Router` исправлена с `/skills` на `/skills/with-desc` |
| `internal/models/user.go` | `ProfileRequest`: +`ID`, `FirstName`, `LastName`. `RegisterRequest` (для Swagger) приведён к новому телу. Новые `UpdateProfileRequest`, `ChangePasswordRequest` |
| `internal/repository/user/GetProfile.go` | `GetMyProfile` и `GetProfile` дополнительно выбирают `id`, `first_name`, `last_name` (через `sql.NullString`, как уже было сделано для `social_link`) |
| `internal/repository/user/GetUser.go` | Новый `GetUsernameByEmail(email)` |
| `internal/repository/skills/GetSkills.go` | `GetAllSkills` и `GetSkillsByCategory` возвращают `[]models.SkillFull` с `LEFT JOIN skill_descriptions` |
| `internal/repository/repository.go` | Интерфейсы `UserRepository` и `SkillRepository` дополнены новыми методами и типами |
| `go.mod` | `golang.org/x/crypto` из indirect стал прямой зависимостью (bcrypt в `ChangePassword`). Версия не менялась |
| `docs/*` | Перегенерированы: `swag init -d ./cmd,internal -o ./docs` |

Не тронуты: middleware, модели и репозиторий skills (кроме `GetSkills.go`), обработчики описаний, админские `UpdateUser` и `DeleteUser`, миграции, `backend/sheets` и `backend/func`.

---

## 5. auth_service — по файлам

Proto-контракт и сгенерированный код не менялись.

| Файл | Изменение |
|---|---|
| `pkg/jwt/token.go` | Добавлен `ParseRefreshToken`, который проверяет токен ключом `RefreshSecret`. Общий код вынесен в `parseToken(token, secret)` |
| `internal/handler/user/RefreshToken.go` | `ParseAccessToken` → `ParseRefreshToken`. **Без этого `/refresh` не работал бы никогда** |
| `internal/handler/user/User.go` | Удалены дубли `ErrUserNotFound` / `ErrUserExists`: это были другие переменные, чем в репозитории, и `errors.Is` никогда не срабатывал. Blacklist защищён `sync.RWMutex` (методы `revoke` / `isRevoked`), просроченные записи вычищаются |
| `internal/handler/user/Logout.go`, `ValidateToken.go` | Работают с blacklist через `revoke` / `isRevoked` |
| `internal/handler/user/Login.go`, `Register.go` | Сравнивают с ошибками репозитория `userrepo.ErrUserNotFound` / `userrepo.ErrUserExists` |
| `internal/repository/user/CreateUser.go` | Дубликат определяется по `*pgconn.PgError` с кодом `23505`. Раньше сравнивалась строка `"pq: ..."`, хотя драйвер pgx, поэтому на дубликат вместо 409 был 500 |
| `internal/repository/user/GetUser.go` | `errors.Is(err, sql.ErrNoRows)` вместо `==` |

---

## 6. Frontend — по файлам

### Новые файлы

| Файл | Содержимое |
|---|---|
| `src/types/api.ts` | `IApiResponse<T>` — формат `ResponseApi` бэкенда |

### Изменённые файлы

| Файл | Изменение |
|---|---|
| `src/constants/api.tsx` | `baseURL` по умолчанию `/api/v1/` (было `http://localhost:5000/api/v1/`) |
| `src/constants/categories.ts` | `categoryCodes`: название категории → код бэкенда (`communicate`, `it`, `art`, `knowledge`, `hobby`) |
| `src/api/index.ts` | Убраны `localStorage` и `Bearer`: токены в cookie. Interceptor на 401 вызывает `POST /refresh` (один общий запрос на все параллельные 401) и повторяет запрос. Хелпер `unwrap` достаёт `result` |
| `src/api/auth.ts` | Пути бэкенда: `register`, `login`, `logout`, `users/me` (GET/PUT), `users/me/password`, `users/profile/:username`. Переименования полей: `link` ↔ `socialLink`, `created_at` → `createdAt`, `login` → `username` |
| `src/api/skill.ts` | Перевод `SkillFull` в `ISkill`: id — строкой, категория из кода в название, контакт парсится из `media` (`"Тип связи: <тип>, Имя: <ник>"` — формат `CreateSkillWithDesc`), `status` пока всегда `ACTIVE`. Выбор ручки ленты по фильтрам, 404 считается пустым списком. Клиентская фильтрация для «Получить»/«Обменять», истории и статистики. Создание обмена через `skills/with-desc` |
| `src/types/skill.ts` | Добавлены `ISkillQuery`, `ISkillStats` |
| `src/store/slices/profileSlice.ts` | Тестовый профиль заменён на `null`. Добавлены `isInitialized` и thunk `fetchProfile` (гость — `null`, а не ошибка) |
| `src/store/slices/skillSlice.ts` | Моки заменены пустыми массивами. Thunk `fetchSkills(query)`, `fetchHistorySkills` (берёт `username` из store), флаг `isLoading` |
| `src/router/loaders/authLoader.tsx` | `ensureProfile` загружает профиль один раз. Новый `loadProfile`; `requireAuth` и `requireGuest` ждут загрузки |
| `src/router/index.tsx` | `loader: loadProfile` у корневого маршрута |
| `src/components/SkillFilter/SkillFilter.tsx` | Категория и тип поиска сразу перезагружают ленту, строка поиска — по кнопке «Найти» (раньше `searchSkill` была пустой) |
| `src/pages/MainPage/MainPage.tsx` | Убран `useProfile()`, надпись «Обменов не найдено» |
| `src/pages/HistoryPage/HistoryPage.tsx` | Убран `useProfile()`, загрузка истории, надпись «Сделок пока нет» |
| `src/pages/StatsPage/StatsPage.tsx` | Статистика за 12 месяцев и итоги |
| `src/components/AnalyticsChart/AnalyticsChart.tsx` | Данные через проп `data` вместо захардкоженных «продаж». Исправлена ошибка типов recharts v3 (`TooltipContentProps`), из-за которой `npm run build` падал ещё до ветки |
| `src/pages/LoginPage/LoginPage.tsx` | После входа загружает профиль в store |
| `src/pages/CreatorPage/CreatorPage.tsx` | Убран `useProfile()`. Передаёт `username` при создании, после публикации переходит на `/profile/history` |
| `src/pages/ProfilePage/ProfilePage.tsx` | Убран `useProfile()` |
| `src/components/ProfileEdit/ProfileEdit.tsx` | Сохранение через `PUT /users/me` с перечитыванием профиля. Добавлена **кнопка «Выйти»** |
| `src/components/ChangePasswordModal/ChangePasswordModal.tsx` | Проверка совпадения паролей и вызов `PUT /users/me/password` (раньше модалка просто закрывалась) |
| `src/components/Header/Header.tsx` | Реальный никнейм вместо `"Username123"` |
| `vite.config.ts` | Цель прокси из `API_PROXY_TARGET` (по умолчанию `http://localhost:8080`) |

### Удалённые файлы

| Файл | Причина |
|---|---|
| `src/hooks/useProfile.ts` | Профиль грузится лоадером роутера. Хук перезапрашивал его на каждой странице и показывал гостю ошибку |
| `src/mock/skills.ts` | Данные идут из API |

---

## 7. Конфигурация

| Файл | Изменение |
|---|---|
| `docker-compose.yml` | У `frontend` `VITE_API_URL=http://localhost:8080` заменён на `API_PROXY_TARGET=http://app:8080`: внутри контейнера `localhost` — это сам контейнер |
| `.env.example` | Добавлен `API_PROXY_TARGET`; `VITE_API_URL` пустой (по умолчанию `/api/v1/`) |

---

## 8. Что важно знать

1. **Роль при регистрации задаёт сервер (`manager`).** Админа можно назначить только в БД.
2. **Старая HTML-страница бэкенда (`GET /` на `:8080`) ведёт себя как в `develop`**: пути не менялись, а лишнее поле `role` в её регистрации просто игнорируется. Создание обмена с этой страницы не работает и в `develop`: `backend/func/script.js` не отправляет `category` ни в `/skills`, ни в `/skills/with-desc`, а `SaveSkill` отклоняет пустую категорию.
3. **Контакт обмена по-прежнему хранится строкой в `skill_descriptions.media`**, как задумано в `CreateSkillWithDesc`. Фронт разбирает эту строку. Если поменять формат строки в бэкенде, нужно поменять и `parseContact` в `frontend/src/api/skill.ts`.
4. **Отдельных ручек для истории и статистики нет.** Фронт загружает всю ленту и фильтрует её по автору. На небольших объёмах этого достаточно; при росте данных стоит добавить серверную ручку.
5. **Статусов обменов (`ACTIVE`/`CLOSED`) в БД нет**, на фронте все обмены активные.
6. **Уникальность `username` проверяется только в `PUT /users/me`.** При регистрации её по-прежнему нет: в БД нет уникального индекса, auth_service его не проверяет.
7. **Если вы запускали прошлую версию ветки (`756d291`) на своей базе**, в ней применена миграция `000007`, которой теперь нет. Бэкенд упадёт с ошибкой миграции. Нужно откатить версию: `migrate -path backend/migrations -database "$DATABASE_URL" force 6`. Лишние колонки `contact_type`, `contact_value`, `status` и уникальный индекс `users_username_key` можно оставить или удалить вручную.
8. **Не исправлялось:** `RequireRole` всегда отвечает 403 (роль кладётся в контекст по ключу `ContextKey("role")`, а читается по строке `"role"`), поэтому админские ручки недоступны. В ответе `/login` в `firstName` передаётся роль. Ни то, ни другое фронту не мешает.

---

## 9. Как проверялось

- `go build ./...` и `go vet ./...` — `backend` и `auth_service` без ошибок.
- `npm run build`, `eslint src`, `stylelint` — без ошибок (кроме предупреждения Vite о размере бандла больше 500 КБ).
- **Сквозная проверка текущей версии в Docker не выполнялась**: на диске свободно около 190 МБ, Docker Desktop не может писать в своё хранилище (`input/output error`). Предыдущая версия ветки проверялась сквозными запросами, но её бэкенд с тех пор переписан. После освобождения места проверить можно так:

  ```bash
  docker compose up --build
  # http://localhost:5173 — регистрация, вход по нику и email, создание обмена,
  # лента / категория / поиск, история, статистика, профиль, смена пароля, выход
  ```
