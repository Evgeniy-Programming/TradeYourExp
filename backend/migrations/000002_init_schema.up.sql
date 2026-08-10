CREATE TABLE IF NOT EXISTS skill_descriptions (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skill_desc_skill_id ON skill_descriptions(skill_id);