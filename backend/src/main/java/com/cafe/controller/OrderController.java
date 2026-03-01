package com.cafe.controller;

import com.cafe.dto.OrderCreateRequest;
import com.cafe.dto.OrderResponse;
import com.cafe.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    @GetMapping("/current")
    public ResponseEntity<List<OrderResponse>> getCurrentOrders() {
        return ResponseEntity.ok(orderService.getCurrentOrders());
    }

    @PatchMapping("/{orderId}/finish")
    public ResponseEntity<OrderResponse> finishOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.finishOrder(orderId));
    }
}
