package com.cafe.service;

import com.cafe.dto.FeedbackRequestDto;
import com.cafe.dto.FeedbackResponseDto;
import com.cafe.dto.FeedbackSummaryResponse;
import com.cafe.entity.Feedback;
import com.cafe.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service layer for feedback operations.
 * <p>
 * Responsibilities:
 * <ul>
 *   <li>Map incoming DTOs to JPA entities (and vice versa)</li>
 *   <li>Apply business rules before persistence</li>
 *   <li>Keep controllers thin and focused on HTTP concerns</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EmailService emailService;

    @Value("${feedback.notify.email:}")
    private String notifyEmail;

    /**
     * Persists a new customer feedback entry and returns a confirmation DTO.
     *
     * @param request validated request DTO from the controller
     * @return response DTO containing the saved record's id and timestamp
     */
    @Transactional
    public FeedbackResponseDto submitFeedback(FeedbackRequestDto request) {
        log.debug("Saving feedback from customer: {}", request.getEmail());

        Feedback entity = Feedback.builder()
                .name(request.getName())
                .email(request.getEmail())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Feedback saved = feedbackRepository.save(entity);

        log.info("Feedback saved — id={}, rating={}", saved.getId(), saved.getRating());

        notifyAdmin(saved);

        return FeedbackResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private void notifyAdmin(Feedback feedback) {
        if (notifyEmail == null || notifyEmail.isBlank()) {
            return;
        }

        String subject = "New feedback received";
        String body = String.format(
                "New feedback received.%n%nName: %s%nEmail: %s%nRating: %d%nComment:%n%s%n",
                feedback.getName(),
                feedback.getEmail(),
                feedback.getRating(),
                feedback.getComment()
        );

        emailService.sendEmail(notifyEmail.trim(), subject, body);
    }

    @Transactional(readOnly = true)
    public FeedbackSummaryResponse getSummary() {
        Double average = feedbackRepository.findAverageRating();
        long total = feedbackRepository.count();

        return FeedbackSummaryResponse.builder()
                .averageRating(average == null ? 0.0 : average)
                .totalRatings(total)
                .build();
    }
}
