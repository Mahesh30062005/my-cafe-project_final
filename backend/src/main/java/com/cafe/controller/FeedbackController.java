package com.cafe.controller;

import com.cafe.dto.FeedbackRequestDto;
import com.cafe.dto.FeedbackResponseDto;
import com.cafe.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for customer feedback endpoints.
 * <p>
 * Endpoints:
 * <ul>
 *   <li>POST /api/feedback — submit a new customer review</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * Accepts a validated feedback payload, persists it, and returns
     * a 201 Created response with the saved record.
     *
     * @param request the feedback payload (validated by @Valid)
     * @return 201 + saved feedback DTO
     */
    @PostMapping
    public ResponseEntity<FeedbackResponseDto> submitFeedback(
            @Valid @RequestBody FeedbackRequestDto request) {

        log.info("Received feedback submission from: {}", request.getEmail());
        FeedbackResponseDto response = feedbackService.submitFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
