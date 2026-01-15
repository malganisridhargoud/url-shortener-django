# Authenticated URL Shortener

A full-stack URL shortener application featuring secure user authentication, a minimalist UI, and robust backend APIs. Built with Django (Backend) and React (Frontend), utilizing MySQL for data storage and Redis for high-performance caching.

## ✨ Features

### 🔐 User Authentication & Security
-   **Secure Registration**: User sign-up with username, email, and password.
-   **JWT Authentication**: Stateless authentication using JSON Web Tokens (Access & Refresh tokens).
-   **Protected Routes**: Dashboard and URL management are restricted to authenticated users.
-   **Password Hashing**: Secure password storage using Django's default hashing mechanisms.

### 🔗 URL Management
-   **Shorten URLs**: Instantly generate short, unique codes for long URLs.
-   **Dashboard View**: View a personal list of your 3 most recent shortened URLs.
-   **Rolling Retention**: Automatically manages storage by keeping only the 3 latest URLs per user.
-   **Delete Capability**: Users can manually remove their own shortened URLs.
-   **Click-to-Open**: Short codes in the dashboard are clickable links for easy access.

### ⚡ Performance & Reliability (Redis)
-   **Caching**: URL redirects are cached in Redis for 15 minutes, ensuring instant redirection without hitting the database repeatedly.
-   **Rate Limiting**: Users are limited to creating **5 URLs per minute** to prevent spam.
-   **Cooldown Timer**: Interactive UI countdown block when the rate limit is exceeded.

### 🎨 User Interface
-   **Minimalist Design**: Clean, modern interface using scoped CSS variables.
-   **Responsive Layout**: Optimized for both desktop and mobile viewing.
-   **User Feedback**: Loading states, error handling, rate-limit timers, and success confirmations.

### 🚀 DevOps & Infrastructure
-   **Dockerized**: Fully containerized Backend, Frontend, Database, and Cache.
-   **Production Ready**: Configured with `Gunicorn` (WSGI server) and `Whitenoise` (Static files).
-   **Database**: MySQL 8.0 integration for reliable persistent storage.
-   **Cache**: Redis (Alpine) for caching and session management.
-   **Deployable**: Ready for deployment on cloud platforms like AWS EC2.

---

## 🛠️ Tech Stack

### Frontend
-   **React.js (v18)**: Component-based UI library.
-   **React Router v6**: Client-side routing.
-   **CSS3**: Custom design system (no heavy CSS frameworks).
-   **Axios/Fetch**: HTTP client for API interaction.
-   **JWT Decode**: Handling token payload on the client side.

### Backend
-   **Python 3.10+**: Core programming language.
-   **Django 5**: High-level web framework.
-   **Django REST Framework (DRF)**: Powerful toolkit for building Web APIs.
-   **SimpleJWT**: JSON Web Token authentication for DRF.
-   **Django Redis**: Cache backend interface.
-   **Django Ratelimit**: Decorator-based rate limiting.
-   **Gunicorn**: Production-grade HTTP server.
-   **Whitenoise**: Static file serving for Python web apps.
-   **MySQL**: Relational database management system.
-   **Redis**: In-memory data structure store for caching/throttling.

### Infrastructure
-   **Docker**: Containerization platform.
-   **Docker Compose**: Multi-container Docker applications tool.
-   **AWS EC2**: (Compatible) Cloud computing platform for deployment.

---

## 🚀 Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

### Prerequisites
-   Docker and Docker Compose installed on your machine.

### Steps
1.  **Clone portions of the repo (if applicable) or navigate to root.**
2.  **Run the application**:
    ```bash
    docker compose up --build
    ```
    *(Note: Ensure you are in the root directory where `docker-compose.yml` resides)*

3.  **Access the App**:
    -   **Frontend**: http://localhost:3000
    -   **Backend API**: http://localhost:8000/api/

The application will automatically set up MySQL, Redis, apply migrations, and start both servers.

---

## ⚙️ Local Development (Manual Setup)

If you prefer to run services manually without Docker, you **MUST** have a local Redis server running on port 6379.

### Backend
1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Create and activate virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Database in `settings.py` (Default expects `localhost` MySQL).
5.  Run Migrations and Server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

### Frontend
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start server:
    ```bash
    npm start
    ```

## 📝 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register/` | Register a new user | No |
| `POST` | `/api/token/` | Login (Obtain Access/Refresh Pair) | No |
| `POST` | `/api/shorten/` | Create a new short URL (Rate Limited) | Yes |
| `GET` | `/api/my-urls/` | List logged-in user's URLs (Max 3) | Yes |
| `DELETE` | `/api/url/<id>/` | Delete a URL | Yes |
| `GET` | `/<short_code>/` | Redirect to original URL (Cached) | No |

---

## License
MIT License
