# ============================================================
# Stage 1 — Build: compile and package the Spring Boot JAR
# ============================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy dependency descriptor first — Docker caches this layer until pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B --no-transfer-progress

# Copy source code and build, skipping tests (run tests in CI separately)
COPY src ./src
RUN mvn package -DskipTests -B --no-transfer-progress

# ============================================================
# Stage 2 — Runtime: minimal JRE image, no build tools
# ============================================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Security: run as a non-root user
RUN addgroup -S cafe && adduser -S cafe -G cafe

WORKDIR /app

# Copy only the fat JAR from the builder stage
COPY --from=builder /build/target/cafe-backend-1.0.0.jar app.jar

# Assign ownership to the non-root user
RUN chown cafe:cafe app.jar

USER cafe

# Spring Boot listens on 8080 by default
EXPOSE 8080

# JVM flags:
#   -Djava.security.egd  speeds up startup on Linux containers
#   -XX:+UseContainerSupport  respects container CPU/memory limits
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
