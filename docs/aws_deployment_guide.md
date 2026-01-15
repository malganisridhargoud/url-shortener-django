# AWS Deployment Guide

This guide describes how to deploy your Authenticated URL Shortener to an AWS EC2 instance.

## 1. Launch EC2 Instance

1.  Log in to your **AWS Console**.
2.  Go to **EC2** Dashboard and click **Launch Instance**.
3.  **Name**: `URL-Shortener-App`
4.  **OS Image**: `Ubuntu Server 24.04 LTS` (Free Tier eligible).
5.  **Instance Type**: `t2.micro` (Free Tier eligible).
6.  **Key Pair**: Create a new key pair (e.g., `url-app-key.pem`) and **download it**.
7.  **Network Settings**:
    -   Click **Edit** in Security Groups.
    -   Add Rule: **SSH** (Port 22) -> Source: Anywhere (or your IP).
    -   Add Rule: **HTTP** (Port 80) -> Source: Anywhere.
    -   Add Rule: **Custom TCP** (Port 3000) -> Source: Anywhere.
    -   Add Rule: **Custom TCP** (Port 8000) -> Source: Anywhere.
8.  Click **Launch Instance**.

## 2. Connect to Instance

Open your terminal and navigate to where your `.pem` key is.

```bash
# Fix key permissions
chmod 400 url-app-key.pem

# Connect (Replace 1.2.3.4 with your EC2 Public IP)
ssh -i "url-app-key.pem" ubuntu@1.2.3.4
```

## 3. Install Docker on EC2

Once connected to the server, run these commands:

```bash
# Update packages
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (avoids using sudo)
sudo usermod -aG docker $USER

# REBOOT for changes to take effect
sudo reboot
```

## 4. Deploy Application

Wait a minute, then reconnect via SSH.

### Option A: Clone from Git (Recommended)
If you have pushed your code to GitHub:
```bash
git clone https://github.com/malganisridhargoud/url-shortener-django.git
cd url-shortener-django
```

### Option B: Copy Files Manually (If no Git)
From your local machine, copy the project folder:
```bash
scp -i "url-app-key.pem" -r ./authenticated-urlshortener-django ubuntu@1.2.3.4:/home/ubuntu/app
```

### Start the App
Navigate to the project directory on the server:

```bash
# Set your DB Host to the container service name 'db'
export DB_HOST=db

# Start services
docker compose up -d --build
```

## 5. Verify

Visit `http://YOUR_EC2_PUBLIC_IP:3000` in your browser.

> **Note**: For a real production app, you would typically use Nginx as a reverse proxy to serve both frontend and backend on Port 80, but this setup works for testing via the ports directly.
