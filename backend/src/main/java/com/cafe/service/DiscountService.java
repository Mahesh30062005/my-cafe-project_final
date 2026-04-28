package com.cafe.service;

import com.cafe.dto.AppliedDiscount;
import com.cafe.dto.ComboDiscountResponse;
import com.cafe.dto.DateDiscountResponse;
import com.cafe.entity.MenuItem;
import com.cafe.entity.OrderItem;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DiscountService {

    public enum LoyaltyTier {
        REGULAR,
        PREMIUM,
        PRIME
    }

    @Getter
    public static class PricingResult {
        private final BigDecimal subtotal;
        private final BigDecimal discountTotal;
        private final BigDecimal total;
        private final List<AppliedDiscount> appliedDiscounts;
        private final LoyaltyTier loyaltyTier;
        private final int membershipDiscountPercent;

        public PricingResult(
                BigDecimal subtotal,
                BigDecimal discountTotal,
                BigDecimal total,
                List<AppliedDiscount> appliedDiscounts,
                LoyaltyTier loyaltyTier,
                int membershipDiscountPercent) {
            this.subtotal = subtotal;
            this.discountTotal = discountTotal;
            this.total = total;
            this.appliedDiscounts = appliedDiscounts;
            this.loyaltyTier = loyaltyTier;
            this.membershipDiscountPercent = membershipDiscountPercent;
        }
    }

    @Value("${loyalty.premium.min-orders:5}")
    private int premiumMinOrders;

    @Value("${loyalty.prime.min-orders:15}")
    private int primeMinOrders;

    @Value("${loyalty.premium.discount-percent:5}")
    private int premiumDiscountPercent;

    @Value("${loyalty.prime.discount-percent:12}")
    private int primeDiscountPercent;

    @Value("${discount.date.start:}")
    private String dateDiscountStart;

    @Value("${discount.date.end:}")
    private String dateDiscountEnd;

    @Value("${discount.date.percent:0}")
    private int dateDiscountPercent;

    @Value("${discount.date.label:}")
    private String dateDiscountLabel;

    @Value("${discount.combo.dessert.buy:3}")
    private int dessertBuyQty;

    @Value("${discount.combo.dessert.free:1}")
    private int dessertFreeQty;

    @Value("${discount.combo.dessert.category:DESSERTS}")
    private String dessertCategory;

    public LoyaltyTier determineTier(long orderCount) {
        if (orderCount >= primeMinOrders) {
            return LoyaltyTier.PRIME;
        }
        if (orderCount >= premiumMinOrders) {
            return LoyaltyTier.PREMIUM;
        }
        return LoyaltyTier.REGULAR;
    }

    public int membershipDiscountPercent(LoyaltyTier tier) {
        return switch (tier) {
            case PRIME -> primeDiscountPercent;
            case PREMIUM -> premiumDiscountPercent;
            default -> 0;
        };
    }

    public PricingResult calculatePricing(List<OrderItem> items, long orderCount) {
        BigDecimal subtotal = calculateSubtotal(items);
        List<AppliedDiscount> discounts = new ArrayList<>();

        BigDecimal comboDiscount = calculateDessertComboDiscount(items);
        if (comboDiscount.compareTo(BigDecimal.ZERO) > 0) {
            discounts.add(AppliedDiscount.builder()
                    .code("DESSERT_COMBO")
                    .description("Dessert combo applied")
                    .amount(comboDiscount)
                    .build());
        }

        BigDecimal discountedBase = subtotal.subtract(comboDiscount);

        LoyaltyTier tier = determineTier(orderCount);
        int membershipPercent = membershipDiscountPercent(tier);
        if (membershipPercent > 0) {
            BigDecimal membershipDiscount = percentOf(discountedBase, membershipPercent);
            discounts.add(AppliedDiscount.builder()
                    .code("LOYALTY_" + tier.name())
                    .description(tier.name().charAt(0) + tier.name().substring(1).toLowerCase()
                            + " member discount (" + membershipPercent + "%)")
                    .amount(membershipDiscount)
                    .build());
            discountedBase = discountedBase.subtract(membershipDiscount);
        }

        DateDiscountResponse dateDiscount = getDateDiscountStatus();
        if (dateDiscount.isActive() && dateDiscountPercent > 0) {
            BigDecimal dateDiscountAmount = percentOf(discountedBase, dateDiscountPercent);
            discounts.add(AppliedDiscount.builder()
                    .code("DATE_DISCOUNT")
                    .description((dateDiscount.getLabel() == null || dateDiscount.getLabel().isBlank())
                            ? "Date discount (" + dateDiscountPercent + "%)"
                            : dateDiscount.getLabel() + " (" + dateDiscountPercent + "%)")
                    .amount(dateDiscountAmount)
                    .build());
            discountedBase = discountedBase.subtract(dateDiscountAmount);
        }

        BigDecimal discountTotal = discounts.stream()
                .map(AppliedDiscount::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal total = subtotal.subtract(discountTotal);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        return new PricingResult(
                subtotal,
                discountTotal,
                total,
                discounts,
                tier,
                membershipPercent
        );
    }

    public DateDiscountResponse getDateDiscountStatus() {
        LocalDate start = parseDate(dateDiscountStart);
        LocalDate end = parseDate(dateDiscountEnd);
        LocalDate today = LocalDate.now();

        boolean afterStart = start == null || !today.isBefore(start);
        boolean beforeEnd = end == null || !today.isAfter(end);
        boolean active = dateDiscountPercent > 0 && afterStart && beforeEnd;

        return DateDiscountResponse.builder()
                .active(active)
                .percent(dateDiscountPercent)
                .startDate(start)
                .endDate(end)
                .label(dateDiscountLabel)
                .build();
    }

    public ComboDiscountResponse getDessertComboStatus() {
        boolean active = dessertBuyQty > 0 && dessertFreeQty > 0;
        String description = active
                ? "Buy " + dessertBuyQty + " get " + dessertFreeQty + " free on desserts"
                : "";

        return ComboDiscountResponse.builder()
                .active(active)
                .category(dessertCategory)
                .buyQty(dessertBuyQty)
                .freeQty(dessertFreeQty)
                .description(description)
                .build();
    }

    private BigDecimal calculateSubtotal(List<OrderItem> items) {
        return items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateDessertComboDiscount(List<OrderItem> items) {
        if (items == null || items.isEmpty() || dessertBuyQty <= 0 || dessertFreeQty <= 0) {
            return BigDecimal.ZERO;
        }

        List<BigDecimal> dessertPrices = new ArrayList<>();
        for (OrderItem item : items) {
            MenuItem menuItem = item.getMenuItem();
            if (menuItem == null || menuItem.getCategory() == null) {
                continue;
            }
            if (!menuItem.getCategory().name().equalsIgnoreCase(dessertCategory)) {
                continue;
            }
            for (int i = 0; i < item.getQuantity(); i += 1) {
                dessertPrices.add(item.getUnitPrice());
            }
        }

        int bundleSize = dessertBuyQty + dessertFreeQty;
        if (dessertPrices.size() < bundleSize) {
            return BigDecimal.ZERO;
        }

        int freeUnits = (dessertPrices.size() / bundleSize) * dessertFreeQty;
        if (freeUnits <= 0) {
            return BigDecimal.ZERO;
        }

        dessertPrices.sort(Comparator.naturalOrder());
        BigDecimal discount = BigDecimal.ZERO;
        for (int i = 0; i < freeUnits && i < dessertPrices.size(); i += 1) {
            discount = discount.add(dessertPrices.get(i));
        }

        return discount;
    }

    private BigDecimal percentOf(BigDecimal amount, int percent) {
        if (percent <= 0 || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return amount
                .multiply(BigDecimal.valueOf(percent))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(raw.trim());
        } catch (Exception ex) {
            return null;
        }
    }
}
