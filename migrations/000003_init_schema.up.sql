DROP TABLE IF EXISTS skill_descriptions;

-- Создай заново с UNIQUE на skill_id
CREATE TABLE skill_descriptions (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER NOT NULL UNIQUE REFERENCES skills(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skill_desc_created ON skill_descriptions(created_at DESC);