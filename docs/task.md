# Redis Caching & OTP Email Login Implementation

## Overview
Implement Redis caching, rate limiting, and OTP-based email authentication for the Django URL shortener application.

## Tasks

### [x] Planning & Setup
- [x] Review current authentication system
- [x] Design OTP email login flow
- [x] Plan Redis integration points
- [x] Create implementation plan

### [x] Redis Installation & Configuration
- [x] Install Redis server
- [x] Install Python Redis clients (redis, django-redis)
- [x] Configure Django to use Redis for caching
- [x] Configure Redis for session storage

### [x] OTP Email Authentication
# Task: UI & Feature Overhaul (React + Django)

### [x] Backend Updates
- [x] Add `user` field to `ShortenedURL` model
- [x] Migrate database
- [x] Create `ShortenedURLSerializer`
- [x] Create API: `POST /api/register/` (Register User)
- [x] Create API: `POST /api/shorten/` (Create Short URL)
- [x] Create API: `GET /api/my-urls/` (List User URLs)
- [x] Create API: `DELETE /api/url/:id/` (Delete URL)

### [x] Frontend Updates
- [x] Setup API service functions (axios/fetch)
- [x] **Registration Page**: Create Minimalist UI + Logic
- [x] **Login Page**: Revamp UI (Clean & Minimal)
- [x] **Dashboard (Shorten URL Page)**:
    - [x] Create URL Input & Submit
    - [x] Display List of Recent URLs
    - [x] Implement Delete Functionality
    - [x] Add Logout Button
- [x] Verify End-to-End Flow
- [x] Cleanup unused files and folders

### [x] Dockerization
- [x] Create Backend Dockerfile
- [x] Create Frontend Dockerfile
- [x] Create docker-compose.yml
- [x] Configure Environment Variables
- [x] Configure Environment Variables
- [x] Verify Build

### [x] AWS Deployment
- [x] Prepare for Production (Gunicorn, Whitenoise)
- [x] Create Production Docker Setup
- [x] Create AWS Deployment Guide (EC2)

### [x] Redis Caching & Rate Limiting
- [x] Add Redis Service to Docker Compose
- [x] Configure Django Cache Settings
- [x] Implement Caching for URL Redirects
- [x] Implement Rate Limiting for URL Creation
