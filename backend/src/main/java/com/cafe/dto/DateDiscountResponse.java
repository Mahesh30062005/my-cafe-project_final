package com.cafe.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DateDiscountResponse {
    private boolean active;
    private int percent;
    private LocalDate startDate;
    private LocalDate endDate;
    private String label;
}
