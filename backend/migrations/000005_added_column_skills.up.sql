-- migrations/004_add_media.up.sql
ALTER TABLE skills ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';