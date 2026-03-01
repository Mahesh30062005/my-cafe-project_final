# ============================================================
# Stage 1 — Build: install dependencies and compile the app
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build tools)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the production bundle
# VITE_API_BASE_URL is intentionally NOT set here — the app uses
# the relative path '/api' which Nginx proxies to the backend service
RUN npm run build

# ============================================================
# Stage 2 — Serve: copy dist into a minimal Nginx image
# ============================================================
FROM nginx:1.25-alpine AS production

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config (handles SPA routing and API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled frontend assets from builder
COPY --from=builder /build/dist /usr/share/nginx/html

# Nginx serves on port 80
EXPOSE 80

# Start Nginx in the foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
