package com.cafe.dto;

import com.cafe.entity.CafeOrder.CourseType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long menuItemId;
    private String name;
    private Integer quantity;
    private CourseType course;
    private BigDecimal unitPrice;
}
