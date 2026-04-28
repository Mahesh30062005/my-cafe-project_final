package com.cafe.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboDiscountResponse {
    private boolean active;
    private String category;
    private int buyQty;
    private int freeQty;
    private String description;
}
