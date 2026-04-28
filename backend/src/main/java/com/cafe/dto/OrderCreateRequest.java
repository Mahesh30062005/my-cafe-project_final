package com.cafe.dto;

import com.cafe.entity.CafeOrder.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    private Integer tableNumber;

    @NotNull(message = "Order type is required")
    private OrderType orderType;

    private String deliveryAddress;

    @Pattern(
            regexp = "^\\+?[0-9]{7,15}$",
            message = "Contact number must be 7 to 15 digits (optionally starting with +)"
    )
    private String customerContactNumber;

    private LocalDateTime pickupOrDeliveryTime;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<OrderItemRequest> items;
}
