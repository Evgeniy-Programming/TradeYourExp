-- Добавляем роль для всех существующих и будущих пользователей
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'manager';

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);