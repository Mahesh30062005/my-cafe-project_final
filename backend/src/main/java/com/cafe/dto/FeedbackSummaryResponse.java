package com.cafe.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackSummaryResponse {
    private double averageRating;
    private long totalRatings;
}
