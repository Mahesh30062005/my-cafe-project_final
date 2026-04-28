package com.cafe.entity;

import com.cafe.config.AppliedDiscountListConverter;
import com.cafe.dto.AppliedDiscount;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * CafeOrder entity for table orders.
 */
@Entity
@Table(name = "cafe_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number")
    private Integer tableNumber;

    @Column(name = "order_number", nullable = false, unique = true, length = 20)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false, length = 20)
    private OrderType orderType;

    @Column(name = "delivery_address", length = 400)
    private String deliveryAddress;

    @Column(name = "customer_contact_number", length = 20)
    private String customerContactNumber;

    @Column(name = "pickup_or_delivery_time")
    private LocalDateTime pickupOrDeliveryTime;

    @Column(name = "packaging_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal packagingFee = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "last_course", length = 20)
    private CourseType lastCourse;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount_total", precision = 10, scale = 2)
    private BigDecimal discountTotal;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal total;

    @Convert(converter = AppliedDiscountListConverter.class)
    @Column(name = "applied_discounts", length = 2000)
    @Builder.Default
    private List<AppliedDiscount> appliedDiscounts = new ArrayList<>();

    @Column(name = "loyalty_tier", length = 20)
    private String loyaltyTier;

    @Column(name = "membership_discount_percent")
    private Integer membershipDiscountPercent;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum OrderStatus {
        OPEN,
        FINISHED
    }

    public enum CourseType {
        STARTER,
        MAIN,
        DESSERT
    }

    public enum OrderType {
        DINE_IN,
        TAKEAWAY,
        DELIVERY
    }
}
