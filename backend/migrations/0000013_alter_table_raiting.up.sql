CREATE INDEX IF NOT EXISTS idx_raiting_received_id ON raiting(received_id);

ALTER TABLE raiting
    ALTER COLUMN last_raiting TYPE DECIMAL(4, 3),
    ALTER COLUMN new_raiting TYPE DECIMAL(4, 3);

ALTER TABLE users
    ALTER COLUMN raiting TYPE DECIMAL(4, 3);

ALTER TABLE users ALTER COLUMN raiting SET DEFAULT 0.000;