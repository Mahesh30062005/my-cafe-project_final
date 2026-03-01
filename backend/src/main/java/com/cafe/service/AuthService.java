package com.cafe.service;

import com.cafe.dto.AuthRequest;
import com.cafe.dto.AuthResponse;
import com.cafe.entity.User;
import com.cafe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse signup(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.CUSTOMER)
                .build();

        userRepository.save(user);

        return issueToken(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        return issueToken(user);
    }

    public AuthResponse issueToken(User user) {
        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash() == null ? "" : user.getPasswordHash())
                        .roles(user.getRole().name())
                        .build(),
                Map.of("role", user.getRole().name())
        );

        LocalDateTime expiresAt = jwtService.extractExpiration(token);

        return AuthResponse.builder()
                .token(token)
                .expiresAt(expiresAt)
                .role(user.getRole().name())
                .build();
    }
}
