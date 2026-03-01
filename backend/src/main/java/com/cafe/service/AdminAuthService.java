package com.cafe.service;

import com.cafe.dto.AdminOtpRequest;
import com.cafe.dto.AdminOtpVerifyRequest;
import com.cafe.dto.AdminPasswordLoginRequest;
import com.cafe.dto.AuthResponse;
import com.cafe.entity.AdminOtp;
import com.cafe.entity.User;
import com.cafe.repository.AdminOtpRepository;
import com.cafe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final UserRepository userRepository;
    private final AdminOtpRepository adminOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${admin.allowed-emails:}")
    private List<String> allowedEmails;

    @Value("${admin.otp.expiration-minutes:5}")
    private long otpExpirationMinutes;

    @Transactional
    public AuthResponse loginWithPassword(AdminPasswordLoginRequest request) {
        requireAllowedEmail(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        if (user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Not an admin account");
        }

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid admin password");
        }

        return issueToken(user);
    }

    @Transactional
    public void requestOtp(AdminOtpRequest request) {
        requireAllowedEmail(request.getEmail());

        String code = String.format("%06d", new Random().nextInt(1_000_000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(otpExpirationMinutes);

        AdminOtp otp = AdminOtp.builder()
                .email(request.getEmail())
                .code(code)
                .expiresAt(expiresAt)
                .used(false)
                .build();

        adminOtpRepository.save(otp);

        String subject = "Your admin OTP for Velvet Bean Cafe";
        String body = "Your one-time password is: " + code + "\nThis code expires in " + otpExpirationMinutes + " minutes.";
        emailService.sendEmail(request.getEmail(), subject, body);
    }

    @Transactional
    public AuthResponse verifyOtp(AdminOtpVerifyRequest request) {
        requireAllowedEmail(request.getEmail());

        AdminOtp otp = adminOtpRepository
                .findTopByEmailAndCodeAndUsedFalseOrderByCreatedAtDesc(request.getEmail(), request.getCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired");
        }

        otp.setUsed(true);
        adminOtpRepository.save(otp);

        User admin = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(request.getEmail())
                        .passwordHash(null)
                        .role(User.Role.ADMIN)
                        .build()));

        if (admin.getRole() != User.Role.ADMIN) {
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        return issueToken(admin);
    }

    private AuthResponse issueToken(User user) {
        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash() == null ? "" : user.getPasswordHash())
                        .roles(user.getRole().name())
                        .build(),
                Map.of("role", user.getRole().name())
        );

        return AuthResponse.builder()
                .token(token)
                .expiresAt(jwtService.extractExpiration(token))
                .role(user.getRole().name())
                .build();
    }

    private void requireAllowedEmail(String email) {
        if (allowedEmails == null || allowedEmails.isEmpty() ||
                allowedEmails.stream().allMatch(item -> item == null || item.isBlank())) {
            return;
        }

        boolean allowed = allowedEmails.stream()
                .map(String::trim)
                .anyMatch(allowedEmail -> allowedEmail.equalsIgnoreCase(email));

        if (!allowed) {
            throw new IllegalArgumentException("Email not allowed for admin access");
        }
    }
}
