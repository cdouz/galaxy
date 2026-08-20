-- V4__notes_content_not_null.sql
-- content was nullable, but the API types it as a string on both sides: a null
-- reached the frontend as `null` and broke Markdown rendering. An empty note has
-- empty content, not absent content.

UPDATE notes SET content = '' WHERE content IS NULL;
ALTER TABLE notes MODIFY content MEDIUMTEXT NOT NULL;
