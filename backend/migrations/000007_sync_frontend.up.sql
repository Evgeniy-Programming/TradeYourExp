-- Поля карточки обмена, которые использует фронтенд
ALTER TABLE skills ADD COLUMN IF NOT EXISTS contact_type TEXT NOT NULL DEFAULT 'site';
ALTER TABLE skills ADD COLUMN IF NOT EXISTS contact_value TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_skills_username ON skills(username);

-- Логин идёт по username, поэтому он должен быть уникальным
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON users(username);
