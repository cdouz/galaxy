-- V2__notes_cascade_delete_on_user.sql
-- Deleting a user must also delete their notes (fk_note_user had no ON DELETE CASCADE)

ALTER TABLE notes DROP FOREIGN KEY fk_note_user;
ALTER TABLE notes ADD CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
