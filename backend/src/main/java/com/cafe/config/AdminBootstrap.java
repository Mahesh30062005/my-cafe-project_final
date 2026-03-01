package com.cafe.config;

import com.cafe.entity.User;
import com.cafe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminBootstrap {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.seed.email:}")
    private String seedEmail;

    @Value("${admin.seed.password:}")
    private String seedPassword;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> {
            if (seedEmail == null || seedEmail.isBlank() || seedPassword == null || seedPassword.isBlank()) {
                return;
            }

            userRepository.findByEmail(seedEmail).ifPresentOrElse(existing -> {
                if (existing.getRole() != User.Role.ADMIN) {
                    existing.setRole(User.Role.ADMIN);
                    existing.setPasswordHash(passwordEncoder.encode(seedPassword));
                    userRepository.save(existing);
                    log.info("Updated existing user to ADMIN: {}", seedEmail);
                }
            }, () -> {
                User admin = User.builder()
                        .email(seedEmail)
                        .passwordHash(passwordEncoder.encode(seedPassword))
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
                log.info("Seeded admin user: {}", seedEmail);
            });
        };
    }
}
