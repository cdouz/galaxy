-- V3__notes_content_mediumtext.sql
-- content was TEXT, i.e. 65535 *bytes*: a note of 20k accented characters already
-- overflowed it and failed at insert time. MEDIUMTEXT (16 MB) leaves room for the
-- 65535-*character* bound now enforced by @Size on the note DTOs.

ALTER TABLE notes MODIFY content MEDIUMTEXT;
