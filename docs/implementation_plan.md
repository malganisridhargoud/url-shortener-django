# Implementation Plan: Redis Caching, Rate Limiting & OTP Email Login

## Overview

Add Redis-based caching, rate limiting, and OTP (One-Time Password) email authentication to the Django URL shortener application. This will improve performance, security, and provide an alternative passwordless login method.

## User Review Required

> [!IMPORTANT]
> **Email Configuration Needed**
> For OTP email functionality to work, you'll need to provide email server credentials (Gmail, SendGrid, etc.). I'll add placeholder configuration that you'll need to update with your actual credentials.

> [!WARNING]
> **Breaking Change: New Authentication Method**
> This adds a new OTP-based login alongside the existing username/password JWT authentication. Both methods will coexist - existing users can continue using password login, and OTP login will be an additional option.

## Proposed Changes

### Dependencies & Installation

#### [NEW] `requirements.txt`

Create a requirements file with all necessary packages:

```txt
# Existing packages (to be verified)
Django>=4.2.4
djangorestframework
djangorestframework-simplejwt
django-cors-headers
pymysql
cryptography

# New packages for Redis & OTP
redis>=5.0.0
django-redis>=5.4.0
django-ratelimit>=4.1.0
celery>=5.3.0  # For async email sending (optional but recommended)
```

---

### Configuration Changes

#### [MODIFY] `backend/settings.py`

Add Redis configuration, caching, rate limiting, and email settings:

**Section 1: Redis Cache Configuration**
```python
# Redis Configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'urlshortener',
        'TIMEOUT': 300,  # 5 minutes default
    }
}

# Session storage in Redis
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'
```

**Section 2: Email Configuration**
```python
# Email Configuration for OTP
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Change based on your provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'  # TO BE CONFIGURED
EMAIL_HOST_PASSWORD = 'your-app-password'  # TO BE CONFIGURED
DEFAULT_FROM_EMAIL = 'URL Shortener <your-email@gmail.com>'

# OTP Settings
OTP_EXPIRY_MINUTES = 5
OTP_LENGTH = 6
```

**Section 3: Rate Limiting**
```python
# Rate Limiting Settings
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = 'default'
```

---

### Application Changes

#### [NEW] `application/utils/otp_manager.py`

Create OTP management utilities using Redis:

```python
import random
import string
from django.core.cache import cache
from django.conf import settings

class OTPManager:
    """Manage OTP generation, storage, and verification using Redis"""
    
    @staticmethod
    def generate_otp(length=6):
        """Generate a random numeric OTP"""
        return ''.join(random.choices(string.digits, k=length))
    
    @staticmethod
    def save_otp(email, otp):
        """Save OTP to Redis with expiry"""
        cache_key = f'otp:{email}'
        timeout = settings.OTP_EXPIRY_MINUTES * 60
        cache.set(cache_key, otp, timeout)
    
    @staticmethod
    def verify_otp(email, otp):
        """Verify OTP from Redis"""
        cache_key = f'otp:{email}'
        stored_otp = cache.get(cache_key)
        
        if stored_otp and stored_otp == otp:
            cache.delete(cache_key)  # Delete after successful verification
            return True
        return False
    
    @staticmethod
    def get_remaining_time(email):
        """Get remaining time for OTP in seconds"""
        cache_key = f'otp:{email}'
        return cache.ttl(cache_key)
```

#### [NEW] `application/utils/email_service.py`

Email sending service for OTP:

```python
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class EmailService:
    """Handle email sending for OTP"""
    
    @staticmethod
    def send_otp_email(email, otp):
        """Send OTP via email"""
        subject = 'Your Login OTP - URL Shortener'
        
        message = f"""
        Your OTP for login is: {otp}
        
        This OTP will expire in {settings.OTP_EXPIRY_MINUTES} minutes.
        
        If you didn't request this, please ignore this email.
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
```

#### [NEW] `application/api/serializers.py` (additions)

Add OTP serializers:

```python
from rest_framework import serializers

class OTPRequestSerializer(serializers.Serializer):
    """Serializer for OTP request"""
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    """Serializer for OTP verification"""
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
```

#### [MODIFY] `application/api/views.py`

Add OTP endpoints with rate limiting:

```python
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from ..utils.otp_manager import OTPManager
from ..utils.email_service import EmailService
from .serializers import OTPRequestSerializer, OTPVerifySerializer

@api_view(['POST'])
@ratelimit(key='ip', rate='3/m', method='POST')  # 3 requests per minute
def request_otp(request):
    """Request OTP for email-based login"""
    serializer = OTPRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal if email exists for security
        return Response({
            'message': 'If this email is registered, an OTP has been sent.'
        }, status=status.HTTP_200_OK)
    
    # Generate and save OTP
    otp = OTPManager.generate_otp(settings.OTP_LENGTH)
    OTPManager.save_otp(email, otp)
    
    # Send email
    try:
        EmailService.send_otp_email(email, otp)
        return Response({
            'message': 'OTP sent to your email',
            'expires_in_minutes': settings.OTP_EXPIRY_MINUTES
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Failed to send email. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@ratelimit(key='ip', rate='5/m', method='POST')  # 5 requests per minute
def verify_otp(request):
    """Verify OTP and return JWT tokens"""
    serializer = OTPVerifySerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    otp = serializer.validated_data['otp']
    
    # Verify OTP
    if not OTPManager.verify_otp(email, otp):
        return Response({
            'error': 'Invalid or expired OTP'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user and generate tokens
    try:
        user = User.objects.get(email=email)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
```

#### [MODIFY] `application/api/urls.py`

Add OTP endpoints:

```python
urlpatterns = [
    # ... existing patterns ...
    path('otp/request/', views.request_otp, name='request_otp'),
    path('otp/verify/', views.verify_otp, name='verify_otp'),
]
```

#### [MODIFY] `application/views.py`

Add caching to URL redirect view:

```python
from django.core.cache import cache

def redirect_to_original(request, short_code):
    # Try to get from cache first
    cache_key = f'url:{short_code}'
    long_url = cache.get(cache_key)
    
    if long_url:
        return HttpResponseRedirect(long_url)
    
    # If not in cache, get from database
    try:
        shortened_url = ShortenedURL.objects.get(short_code=short_code)
        # Cache for 1 hour
        cache.set(cache_key, shortened_url.long_url, 3600)
        return HttpResponseRedirect(shortened_url.long_url)
    except ShortenedURL.DoesNotExist:
        error_message = "Please try again."
        return render(request, 'shorten_url.html', {'error_message': error_message})
```

---

## Implementation Plan: UI & Feature Revamp

## Goal
Revamp the application to have a minimalist, "premium" feel. Restrict access to authenticated users only. Add functionality to list and delete user-specific shortened URLs.

## Backend Changes

### Models (`application/models.py`)
- [MODIFY] `ShortenedURL`: Add `user = ForeignKey(User)` field to link URLs to their creators.

### API (`application/api/`)
- [NEW] `serializers.py`: Add `ShortenedURLSerializer`, `RegisterSerializer`.
- [MODIFY] `views.py`:
    - Add `register_user` (API version).
    - Add `create_short_url` (Authenticated).
    - Add `get_user_urls` (Authenticated).
    - Add `delete_short_url` (Authenticated).
- [MODIFY] `urls.py`: Wire up new endpoints.

## Frontend Changes

### Design System
- Use CSS Variables for a consistent, minimal color palette (Authored in `App.css` or new `index.css`).
- Focus on spacing, typography, and subtle shadows.

### Pages
- [MODIFY] `LoginPage.jsx`: Style update.
- [NEW] `RegisterPage.jsx`: New component for user registration via API.
- [NEW] `Dashboard.jsx`: The main authenticated view.
    - Hero section for URL shortening.
    - Table/Grid for "Recent URLs" with Copy and Delete actions.
    - Header with Logout.

## Dockerization Plan

### Goal
Containerize the application to allow easy setup and running with a single command: `docker-compose up`.

### Files to Create
1.  **Backend Dockerfile** (`backend/Dockerfile`)
    -   Base Image: `python:3.9-slim` (or similar)
    -   Install dependencies from `requirements.txt`
    -   Command: `python manage.py runserver 0.0.0.0:8000`
2.  **Frontend Dockerfile** (`frontend/Dockerfile`)
    -   Base Image: `node:16` (or similar)
    -   Install dependencies (`npm install`)
    -   Command: `npm start` (Host: 0.0.0.0)
3.  **Docker Compose** (`docker-compose.yml`)
    -   **db**: MySQL 8.0 image.
    -   **backend**: Builds from `./backend`. Depends on `db`.
    -   **frontend**: Builds from `./frontend`.

### Configuration Changes
-   **Backend**: Update `settings.py` to accept Database Host via Environment Variable (`DB_HOST`).
-   **Frontend**: Ensure API URL is accessible (dev setup might need proxy or direct URL).

## AWS Deployment Plan

### Goal
Deploy the Dockerized application to an AWS EC2 instance.

### Production Readiness
1.  **Dependencies**: Add `gunicorn` (Application Server) and `whitenoise` (Static File Serving) to `requirements.txt`.
2.  **Configuration**: Update `settings.py` to:
    -   Use `whitenoise` Middleware.
    -   Set `static` root.
3.  **Docker**: Update `backend/Dockerfile` (or command) to run `gunicorn` instead of `runserver`.

### Deployment Guide (`aws_deployment_guide.md`)
I will create a step-by-step guide covering:
1.  **EC2 Setup**: Launching a t2.micro (Free Tier) instance (Ubuntu).
2.  **Security Groups**: Allowing ports 80, 3000, 8000.
3.  **Installation**: Installing Docker and Docker Compose on EC2.
4.  **Deployment**: Copying project files and running `docker-compose up`.

### Verification
-   The user will follow the guide to deploy.
-   I will verify the configuration changes locally.

2. If you want me to proceed with implementation
3. Any modifications to the OTP flow or rate limits
