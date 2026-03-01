package com.cafe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Global CORS configuration.
 * <p>
 * Permits the React development server (port 3000) and the Dockerised Nginx
 * frontend (port 80) to call the Spring Boot API. Origins are configurable
 * via the {@code CORS_ORIGINS} environment variable for easy deployment.
 */
@Configuration
public class CorsConfig {

    /**
     * Comma-separated list of allowed origins.
     * Defaults to localhost ports used in dev and Docker environments.
     */
    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:80,http://localhost}")
    private List<String> allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Specify exact allowed origins (wildcards are insecure with credentials)
        config.setAllowedOrigins(allowedOrigins);

        // Standard HTTP methods required by a REST API
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Allow all standard headers + Content-Type and Authorization
        config.setAllowedHeaders(List.of("*"));

        // Expose any custom response headers to the browser
        config.setExposedHeaders(List.of("Location"));

        // Required if the frontend ever sends cookies or auth headers
        config.setAllowCredentials(true);

        // Cache preflight response for 30 minutes
        config.setMaxAge(1800L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
