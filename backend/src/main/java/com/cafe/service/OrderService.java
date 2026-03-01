package com.cafe.service;

import com.cafe.dto.OrderCreateRequest;
import com.cafe.dto.OrderItemRequest;
import com.cafe.dto.OrderItemResponse;
import com.cafe.dto.OrderResponse;
import com.cafe.entity.CafeOrder;
import com.cafe.entity.MenuItem;
import com.cafe.entity.OrderItem;
import com.cafe.repository.CafeOrderRepository;
import com.cafe.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final CafeOrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {
        CafeOrder order = CafeOrder.builder()
                .tableNumber(request.getTableNumber())
                .status(CafeOrder.OrderStatus.OPEN)
                .build();

        List<OrderItem> items = request.getItems().stream()
                .map(itemRequest -> buildOrderItem(order, itemRequest))
                .collect(Collectors.toList());

        order.getItems().addAll(items);
        order.setLastCourse(determineLastCourse(items));

        CafeOrder saved = orderRepository.save(order);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCurrentOrders() {
        return orderRepository.findByStatusOrderByCreatedAtAsc(CafeOrder.OrderStatus.OPEN)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse finishOrder(Long orderId) {
        CafeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setStatus(CafeOrder.OrderStatus.FINISHED);
        CafeOrder saved = orderRepository.save(order);

        return toResponse(saved);
    }

    private OrderItem buildOrderItem(CafeOrder order, OrderItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));

        return OrderItem.builder()
                .order(order)
                .menuItem(menuItem)
                .quantity(request.getQuantity())
                .course(request.getCourse())
                .unitPrice(menuItem.getPrice())
                .build();
    }

    private CafeOrder.CourseType determineLastCourse(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            return null;
        }

        Map<CafeOrder.CourseType, Integer> weights = Map.of(
                CafeOrder.CourseType.STARTER, 1,
                CafeOrder.CourseType.MAIN, 2,
                CafeOrder.CourseType.DESSERT, 3
        );

        return items.stream()
                .map(OrderItem::getCourse)
                .max(Comparator.comparingInt(course -> weights.getOrDefault(course, 0)))
                .orElse(null);
    }

    private OrderResponse toResponse(CafeOrder order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItem().getId())
                        .name(item.getMenuItem().getName())
                        .quantity(item.getQuantity())
                        .course(item.getCourse())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .tableNumber(order.getTableNumber())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
