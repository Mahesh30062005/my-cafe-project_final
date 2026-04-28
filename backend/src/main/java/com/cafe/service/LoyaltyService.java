package com.cafe.service;

import com.cafe.dto.LoyaltyStatusResponse;
import com.cafe.entity.User;
import com.cafe.repository.CafeOrderRepository;
import com.cafe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final CafeOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DiscountService discountService;

    @Value("${loyalty.premium.min-orders:5}")
    private int premiumMinOrders;

    @Value("${loyalty.prime.min-orders:15}")
    private int primeMinOrders;

    @Transactional(readOnly = true)
    public LoyaltyStatusResponse getStatusForEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long totalOrders = orderRepository.countByUserId(user.getId());
        DiscountService.LoyaltyTier tier = discountService.determineTier(totalOrders);
        int discountPercent = discountService.membershipDiscountPercent(tier);

        return LoyaltyStatusResponse.builder()
                .tier(tier.name())
                .totalOrders(totalOrders)
                .premiumAt(premiumMinOrders)
                .primeAt(primeMinOrders)
                .discountPercent(discountPercent)
                .dateDiscount(discountService.getDateDiscountStatus())
                .dessertCombo(discountService.getDessertComboStatus())
                .build();
    }
}
