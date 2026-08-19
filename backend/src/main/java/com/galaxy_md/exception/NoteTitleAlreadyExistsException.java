package com.galaxy_md.exception;

public class NoteTitleAlreadyExistsException extends RuntimeException {
    public NoteTitleAlreadyExistsException(String title) {
        super("Title already exists: " + title);
    }
}
