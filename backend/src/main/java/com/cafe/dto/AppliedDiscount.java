package com.cafe.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppliedDiscount {
    private String code;
    private String description;
    private BigDecimal amount;
}
