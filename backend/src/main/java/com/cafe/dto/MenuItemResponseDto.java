package com.cafe.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO for a single menu item in the API response.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponseDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private int displayOrder;
}
