package com.cafe.exception;

/**
 * Thrown when a requested resource does not exist in the database.
 * Mapped to HTTP 404 by {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s with id %d was not found.", resourceName, id));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
