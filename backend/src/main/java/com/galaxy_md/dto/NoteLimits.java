package com.galaxy_md.dto;

/**
 * Input bounds for note fields, kept in sync with the column types declared in
 * V1__init.sql: notes.title is VARCHAR(255), notes.content is TEXT (64 KB).
 * Without them, an oversized field only fails at insert time, as a 500.
 */
public final class NoteLimits {

    public static final int TITLE_MAX_LENGTH = 255;
    public static final int CONTENT_MAX_LENGTH = 65_535;

    private NoteLimits() {
    }
}
