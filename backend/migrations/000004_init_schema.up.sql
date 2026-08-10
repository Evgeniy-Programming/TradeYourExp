-- migrations/004_add_media.up.sql
ALTER TABLE skill_descriptions ADD COLUMN IF NOT EXISTS media TEXT DEFAULT '';