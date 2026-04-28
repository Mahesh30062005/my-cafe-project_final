package com.cafe.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingSummary {
    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal packagingFee;
    private BigDecimal total;
    private List<AppliedDiscount> appliedDiscounts;
    private String loyaltyTier;
    private Integer membershipDiscountPercent;
}
