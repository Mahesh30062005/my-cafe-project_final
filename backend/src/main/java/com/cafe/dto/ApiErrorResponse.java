package com.cafe.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardised error response body returned by {@link com.cafe.exception.GlobalExceptionHandler}.
 * {@code fieldErrors} is only included when validation fails (non-null).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;

    /** Per-field validation errors, e.g. { "email": "Must be a valid email" } */
    private Map<String, String> fieldErrors;
}
