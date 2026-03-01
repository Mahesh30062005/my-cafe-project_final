package com.cafe.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    @NotNull(message = "Table number is required")
    private Integer tableNumber;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<OrderItemRequest> items;
}
