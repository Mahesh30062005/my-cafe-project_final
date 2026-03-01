package com.cafe.controller;

import com.cafe.dto.AdminOtpRequest;
import com.cafe.dto.AdminOtpVerifyRequest;
import com.cafe.dto.AdminPasswordLoginRequest;
import com.cafe.dto.AuthResponse;
import com.cafe.service.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/password")
    public ResponseEntity<AuthResponse> loginWithPassword(@Valid @RequestBody AdminPasswordLoginRequest request) {
        return ResponseEntity.ok(adminAuthService.loginWithPassword(request));
    }

    @PostMapping("/otp/request")
    public ResponseEntity<Void> requestOtp(@Valid @RequestBody AdminOtpRequest request) {
        adminAuthService.requestOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody AdminOtpVerifyRequest request) {
        return ResponseEntity.ok(adminAuthService.verifyOtp(request));
    }
}
