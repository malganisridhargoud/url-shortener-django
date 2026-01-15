# Project Complete: Authenticated URL Shortener with Redis

## Summary
The application is now a fully containerized, production-ready URL shortener with authentication, caching, and rate limiting.

## ✨ Final Features

### 1. **Core Functionality**
-   **User Auth**: Register/Login with JWT.
-   **URL Shortening**: Generate short codes for long URLs.
-   **Dashboard**: Manage your own URLs.
-   **Rolling Limit**: Automatically keeps only your **3 most recent** URLs.

### 2. **Performance (Redis)**
-   **Caching**: Redirects are cached for 15 minutes for instant speed.
-   **Rate Limiting**: Limits creation to **5 URLs per minute**.
-   **UI Timer**: Interactive countdown when rate limit is hit.

### 3. **Infrastructure**
-   **Docker Compose**: Orchestrates Django, React, MySQL, and Redis.
-   **Clickable Links**: Short codes in dashboard are now clickable active links.

## 🚀 How to Run (Docker)
This is the recommended way to ensure Redis works correctly:

```bash
docker compose up --build
```
Access Frontend at `http://localhost:3000`.

## 📌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten/` | Create short URL (Rate Limited 5/min) |
| `GET`  | `/api/my-urls/` | Get user's recent 3 URLs |
| `GET`  | `/<code/>` | Redirect to original (Cached) |
