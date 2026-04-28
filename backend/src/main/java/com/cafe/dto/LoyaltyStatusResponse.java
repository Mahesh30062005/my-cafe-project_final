package com.cafe.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyStatusResponse {
    private String tier;
    private long totalOrders;
    private int premiumAt;
    private int primeAt;
    private int discountPercent;
    private DateDiscountResponse dateDiscount;
    private ComboDiscountResponse dessertCombo;
}
