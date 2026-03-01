package com.cafe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Feedback entity — maps to the "feedback" table.
 * Stores customer review submissions.
 */
@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Customer's display name */
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    /** Customer's email address */
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Column(nullable = false, length = 150)
    private String email;

    /** Star rating from 1–5 */
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    @Column(nullable = false)
    private Integer rating;

    /** Free-text customer comment */
    @NotBlank(message = "Comment is required")
    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    @Column(nullable = false, length = 1000)
    private String comment;

    /** Auto-populated creation timestamp */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
