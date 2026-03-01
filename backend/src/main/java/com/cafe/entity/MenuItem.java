package com.cafe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * MenuItem entity — maps to the "menu_items" table.
 * Represents a single item on the cafe's menu.
 */
@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal price;

    /** Category grouping for the menu page */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MenuCategory category;

    /** Whether this item is currently being served */
    @Column(nullable = false)
    private boolean available;

    /** Controls display ordering within a category */
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    // -------------------------------------------------
    // Inner enum for menu categories
    // Using STRING mapping keeps DB data human-readable
    // -------------------------------------------------
    public enum MenuCategory {
        HOT_BEVERAGES,
        COLD_BEVERAGES,
        PASTRIES,
        STARTERS,
        MAINS,
        DESSERTS
    }
}
