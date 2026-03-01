package com.cafe.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO for the outgoing response after a feedback submission.
 * Keeps the API contract stable — the entity can evolve without breaking clients.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponseDto {
    private Long id;
    private String name;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
