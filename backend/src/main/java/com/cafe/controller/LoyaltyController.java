package com.cafe.controller;

import com.cafe.dto.LoyaltyStatusResponse;
import com.cafe.service.LoyaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @GetMapping("/me")
    public ResponseEntity<LoyaltyStatusResponse> getStatus(Authentication authentication) {
        return ResponseEntity.ok(loyaltyService.getStatusForEmail(authentication.getName()));
    }
}
