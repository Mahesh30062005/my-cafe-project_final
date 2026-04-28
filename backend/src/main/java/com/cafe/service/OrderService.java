package com.cafe.service;

import com.cafe.dto.OrderCreateRequest;
import com.cafe.dto.OrderItemRequest;
import com.cafe.dto.OrderItemResponse;
import com.cafe.dto.OrderResponse;
import com.cafe.dto.PricingSummary;
import com.cafe.entity.CafeOrder;
import com.cafe.entity.MenuItem;
import com.cafe.entity.OrderItem;
import com.cafe.entity.User;
import com.cafe.entity.CafeOrder.OrderType;
import com.cafe.repository.CafeOrderRepository;
import com.cafe.repository.MenuItemRepository;
import com.cafe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private static final DateTimeFormatter ORDER_DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");
    private static final DateTimeFormatter ORDER_TIME_FORMAT = DateTimeFormatter.ofPattern("HHmm");

    private final CafeOrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final DiscountService discountService;

    @Value("${order.packaging.fee:20}")
    private BigDecimal packagingFeeAmount;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {
        User user = getCurrentUser();
        validateOrderRequest(request);

        Integer tableNumber = request.getOrderType() == OrderType.DINE_IN ? request.getTableNumber() : null;

        CafeOrder order = CafeOrder.builder()
                .tableNumber(tableNumber)
                .orderNumber(generateOrderNumber(LocalDateTime.now()))
                .status(CafeOrder.OrderStatus.OPEN)
                .orderType(request.getOrderType())
                .deliveryAddress(request.getDeliveryAddress())
                .customerContactNumber(request.getCustomerContactNumber())
                .pickupOrDeliveryTime(request.getPickupOrDeliveryTime())
                .packagingFee(BigDecimal.ZERO)
                .user(user)
                .build();

        List<OrderItem> items = request.getItems().stream()
                .map(itemRequest -> buildOrderItem(order, itemRequest))
                .collect(Collectors.toList());

        order.getItems().addAll(items);
        order.setLastCourse(determineLastCourse(items));

        long existingOrderCount = orderRepository.countByUserId(user.getId());
        DiscountService.PricingResult pricingResult = discountService.calculatePricing(items, existingOrderCount);
        applyPricing(order, pricingResult);
        applyPackagingFee(order, pricingResult);

        CafeOrder saved = persistWithOrderNumberRetry(order);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCurrentOrders() {
        return orderRepository.findByStatusOrderByCreatedAtAsc(CafeOrder.OrderStatus.OPEN)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveParcelOrders() {
        List<CafeOrder.OrderType> parcelTypes = List.of(OrderType.TAKEAWAY, OrderType.DELIVERY);
        return orderRepository.findByStatusAndOrderTypeInOrderByCreatedAtAsc(
                        CafeOrder.OrderStatus.OPEN,
                        parcelTypes
                )
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
                .orderNumber(order.getOrderNumber())
                .tableNumber(order.getTableNumber())
                .status(order.getStatus())
                .orderType(order.getOrderType())
                .deliveryAddress(order.getDeliveryAddress())
                .customerContactNumber(order.getCustomerContactNumber())
                .pickupOrDeliveryTime(order.getPickupOrDeliveryTime())
                .packagingFee(order.getPackagingFee())
                .createdAt(order.getCreatedAt())
                .items(items)
                .pricing(buildPricingSummary(order, items))
                .build();
    }

    private void applyPricing(CafeOrder order, DiscountService.PricingResult pricing) {
        order.setSubtotal(pricing.getSubtotal());
        order.setDiscountTotal(pricing.getDiscountTotal());
        order.setTotal(pricing.getTotal());
        order.setAppliedDiscounts(pricing.getAppliedDiscounts());
        order.setLoyaltyTier(pricing.getLoyaltyTier().name());
        order.setMembershipDiscountPercent(pricing.getMembershipDiscountPercent());
    }

    private PricingSummary buildPricingSummary(CafeOrder order, List<OrderItemResponse> items) {
        if (order.getSubtotal() == null || order.getTotal() == null) {
            BigDecimal subtotal = items.stream()
                    .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal packagingFee = order.getPackagingFee() == null ? BigDecimal.ZERO : order.getPackagingFee();
            BigDecimal total = subtotal.add(packagingFee);

            return PricingSummary.builder()
                    .subtotal(subtotal)
                    .discountTotal(BigDecimal.ZERO)
                    .packagingFee(packagingFee)
                    .total(total)
                    .appliedDiscounts(List.of())
                    .loyaltyTier(order.getLoyaltyTier() == null ? "REGULAR" : order.getLoyaltyTier())
                    .membershipDiscountPercent(order.getMembershipDiscountPercent() == null ? 0 : order.getMembershipDiscountPercent())
                    .build();
        }

        return PricingSummary.builder()
                .subtotal(order.getSubtotal())
                .discountTotal(order.getDiscountTotal())
                .packagingFee(order.getPackagingFee() == null ? BigDecimal.ZERO : order.getPackagingFee())
                .total(order.getTotal())
                .appliedDiscounts(order.getAppliedDiscounts() == null ? List.of() : order.getAppliedDiscounts())
                .loyaltyTier(order.getLoyaltyTier() == null ? "REGULAR" : order.getLoyaltyTier())
                .membershipDiscountPercent(order.getMembershipDiscountPercent() == null ? 0 : order.getMembershipDiscountPercent())
                .build();
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalArgumentException("User is not authenticated");
        }

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void validateOrderRequest(OrderCreateRequest request) {
        if (request.getOrderType() == null) {
            throw new IllegalArgumentException("Order type is required");
        }

        if (request.getOrderType() == OrderType.DINE_IN && request.getTableNumber() == null) {
            throw new IllegalArgumentException("Table number is required for dine-in orders");
        }

        boolean requiresContact = request.getOrderType() == OrderType.TAKEAWAY
                || request.getOrderType() == OrderType.DELIVERY;
        if (requiresContact && (request.getCustomerContactNumber() == null || request.getCustomerContactNumber().isBlank())) {
            throw new IllegalArgumentException("Contact number is required for takeaway or delivery orders");
        }

        if (request.getOrderType() == OrderType.DELIVERY) {
            if (request.getDeliveryAddress() == null || request.getDeliveryAddress().isBlank()) {
                throw new IllegalArgumentException("Delivery address is required for delivery orders");
            }
        }
    }

    private void applyPackagingFee(CafeOrder order, DiscountService.PricingResult pricing) {
        if (order.getOrderType() == OrderType.TAKEAWAY || order.getOrderType() == OrderType.DELIVERY) {
            BigDecimal fee = packagingFeeAmount == null ? BigDecimal.ZERO : packagingFeeAmount;
            order.setPackagingFee(fee);
            order.setTotal(pricing.getTotal().add(fee));
        } else {
            order.setPackagingFee(BigDecimal.ZERO);
            order.setTotal(pricing.getTotal());
        }
    }

    private String generateOrderNumber(LocalDateTime now) {
        LocalDateTime candidateTime = now;

        for (int minuteOffset = 0; minuteOffset < 60; minuteOffset += 1) {
            String datePart = ORDER_DATE_FORMAT.format(candidateTime);
            String timePart = ORDER_TIME_FORMAT.format(candidateTime);
            int dayNumber = candidateTime.getDayOfWeek().getValue();

            for (int seq = 0; seq < 10; seq += 1) {
                String candidate = datePart + dayNumber + timePart + seq;
                if (!orderRepository.existsByOrderNumber(candidate)) {
                    return candidate;
                }
            }

            candidateTime = candidateTime.plusMinutes(1);
        }

        throw new IllegalStateException("Unable to generate unique order number");
    }

    private CafeOrder persistWithOrderNumberRetry(CafeOrder order) {
        int attempts = 0;
        while (attempts < 3) {
            try {
                return orderRepository.saveAndFlush(order);
            } catch (DataIntegrityViolationException ex) {
                attempts += 1;
                order.setOrderNumber(generateOrderNumber(LocalDateTime.now().plusMinutes(attempts)));
            }
        }
        throw new IllegalStateException("Unable to persist order with a unique order number");
    }
}
