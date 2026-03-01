# Velvet Bean Cafe - Full-Stack Website

A full-stack cafe website built with React + Vite, Spring Boot 3, and Tailwind.
Default dev database is H2 (in-memory). A Postgres profile is included for future deployment.

## Project Structure

```
cafe/
├── backend/                              Spring Boot (Java 17)
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/cafe/
│       │   ├── CafeApplication.java
│       │   ├── config/
│       │   │   └── CorsConfig.java
│       │   ├── controller/
│       │   │   ├── FeedbackController.java
│       │   │   └── MenuController.java
│       │   ├── dto/
│       │   │   ├── ApiErrorResponse.java
│       │   │   ├── FeedbackRequestDto.java
│       │   │   ├── FeedbackResponseDto.java
│       │   │   └── MenuItemResponseDto.java
│       │   ├── entity/
│       │   │   ├── Feedback.java
│       │   │   └── MenuItem.java
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   └── ResourceNotFoundException.java
│       │   ├── repository/
│       │   │   ├── FeedbackRepository.java
│       │   │   └── MenuItemRepository.java
│       │   └── service/
│       │       ├── FeedbackService.java
│       │       └── MenuService.java
│       └── resources/
│           ├── application.properties
│           ├── application-prod.properties
│           └── data.sql
├── frontend/                             React 18 + Vite + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── client.js
│       ├── hooks/
│       │   └── useMenu.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── MenuPage.jsx
│           ├── FeedbackPage.jsx
│           └── NotFoundPage.jsx
└── infra/
    └── nginx/
        └── nginx.conf                    Stored for future use
```

## Local Development (no Docker)

### Backend

Requirements: Java 17+, Maven

```bash
cd backend
mvn spring-boot:run
```

Backend API: http://localhost:8080

Notes:
- Uses H2 in-memory DB by default.
- Seed data is loaded from `data.sql` on startup.
- To use Postgres later, run with `-Dspring.profiles.active=prod` and set DB env vars.

### Frontend

Requirements: Node 20+

```bash
cd frontend
npm install
npm run dev
```

Frontend app: http://localhost:3000
Vite proxies `/api` to `http://localhost:8080`.

## API Reference

### GET /api/menu
Returns all available menu items grouped by category.

### POST /api/feedback
Saves a customer review.

## Design System

| Token           | Value     | Usage                |
|----------------|-----------|----------------------|
| espresso-500   | #8B4513   | Primary brand color  |
| latte-400/500  | #D4A853   | Gold accent          |
| cream-100      | #FFF8F0   | Page background      |
| bark-800/900   | #2c1a0e   | Dark text / footers  |
| --muted        | #7a6555   | Secondary text       |
| Display font   | Cormorant Garamond | Headings |
| Body font      | DM Sans   | UI text              |
| Script font    | Pinyon Script | Accent labels    |

## Key Architecture Decisions

- Layered backend: Controller -> Service -> Repository.
- DTO separation: Request/Response DTOs isolate the API contract from the JPA entity model.
- Optimistic seeding: `data.sql` uses `WHERE NOT EXISTS` to avoid duplicates on restart.
- Vite dev proxy: `/api` is proxied to `localhost:8080` in dev to avoid CORS issues.
- Nginx config is kept under `infra/nginx` for future deployment work.