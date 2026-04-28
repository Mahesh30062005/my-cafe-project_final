package com.cafe.dto;

import com.cafe.entity.CafeOrder.OrderStatus;
import com.cafe.entity.CafeOrder.OrderType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Integer tableNumber;
    private OrderStatus status;
    private OrderType orderType;
    private String deliveryAddress;
    private String customerContactNumber;
    private LocalDateTime pickupOrDeliveryTime;
    private BigDecimal packagingFee;
    private PricingSummary pricing;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
