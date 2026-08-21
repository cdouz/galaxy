-- V5__users_token_version.sql
-- Lets logout actually revoke a token. The version is carried in the JWT and
-- compared on every request; bumping it here invalidates the tokens issued so far.

ALTER TABLE users ADD COLUMN token_version BIGINT NOT NULL DEFAULT 0;
