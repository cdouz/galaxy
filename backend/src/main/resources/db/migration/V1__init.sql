-- V1__init.sql
-- Schéma initial de Galaxy : users, notes, links

CREATE TABLE users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)  NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notes (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    title      VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_as_ci,
    content    TEXT,
    created_at DATETIME     NOT NULL,
    updated_at DATETIME     NOT NULL,
    user_id    BIGINT       NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_note_user_title (user_id, title),
    CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE links (
    id             BIGINT   NOT NULL AUTO_INCREMENT,
    source_note_id BIGINT   NOT NULL,
    target_note_id BIGINT   NOT NULL,
    created_at     DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_link_source_target (source_note_id, target_note_id),
    CONSTRAINT fk_link_source FOREIGN KEY (source_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    CONSTRAINT fk_link_target FOREIGN KEY (target_note_id) REFERENCES notes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
