# 🔐 GitHub Secrets Setup Guide

This guide explains how to set up the required GitHub secrets for the CI/CD pipeline.

## 📋 Required Secrets

### 🔑 SSH Keys
1. **STAGING_SSH_KEY** - Private SSH key for staging server
2. **PRODUCTION_SSH_KEY** - Private SSH key for production server

### 🌐 Server Information
3. **STAGING_HOST** - Staging server IP/hostname
4. **STAGING_USER** - SSH username for staging server
5. **PRODUCTION_HOST** - Production server IP/hostname
6. **PRODUCTION_USER** - SSH username for production server

### 🌍 Domain Configuration
7. **DOMAIN** - Your production domain (e.g., `yourdomain.com`)
8. **ADMIN_EMAIL** - Admin email for SSL certificates

### 🔒 Security
9. **SNYK_TOKEN** - Snyk security scan token (optional)
10. **SLACK_WEBHOOK** - Slack webhook URL for notifications (optional)

## 🛠️ Setup Instructions

### Step 1: Generate SSH Keys

```bash
# Generate SSH key for staging
ssh-keygen -t rsa -b 4096 -C "staging@yourdomain.com" -f ~/.ssh/staging_key

# Generate SSH key for production
ssh-keygen -t rsa -b 4096 -C "production@yourdomain.com" -f ~/.ssh/production_key
```

### Step 2: Add Public Keys to Servers

```bash
# Add staging public key to staging server
ssh-copy-id -i ~/.ssh/staging_key.pub staging_user@staging_host

# Add production public key to production server
ssh-copy-id -i ~/.ssh/production_key.pub production_user@production_host
```

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Secret Name | Value |
|-------------|-------|
| `STAGING_SSH_KEY` | Content of `~/.ssh/staging_key` |
| `PRODUCTION_SSH_KEY` | Content of `~/.ssh/production_key` |
| `STAGING_HOST` | Your staging server IP/hostname |
| `STAGING_USER` | SSH username for staging |
| `PRODUCTION_HOST` | Your production server IP/hostname |
| `PRODUCTION_USER` | SSH username for production |
| `DOMAIN` | Your domain (e.g., `yourdomain.com`) |
| `ADMIN_EMAIL` | Your admin email |
| `SNYK_TOKEN` | Your Snyk token (optional) |
| `SLACK_WEBHOOK` | Your Slack webhook URL (optional) |

### Step 4: Server Setup

#### Staging Server
```bash
# Create deployment directory
sudo mkdir -p /opt/tvc-educate
sudo chown $USER:$USER /opt/tvc-educate

# Clone repository
cd /opt
git clone https://github.com/yourusername/tvc-educate.git
cd tvc-educate

# Create environment files
cp .env.example .env.staging
# Edit .env.staging with staging values
```

#### Production Server
```bash
# Create deployment directory
sudo mkdir -p /opt/tvc-educate
sudo chown $USER:$USER /opt/tvc-educate

# Clone repository
cd /opt
git clone https://github.com/yourusername/tvc-educate.git
cd tvc-educate

# Create environment files
cp .env.example .env.production
# Edit .env.production with production values

# Make SSL setup script executable
chmod +x ssl-setup.sh
```

### Step 5: Test Deployment

1. Push to `develop` branch for staging deployment
2. Push to `main` branch for production deployment

## 🔍 Verification

### Check Staging Deployment
```bash
ssh staging_user@staging_host
cd /opt/tvc-educate
docker-compose ps
curl http://staging_host/health
```

### Check Production Deployment
```bash
ssh production_user@production_host
cd /opt/tvc-educate
docker-compose ps
curl https://yourdomain.com/health
```

## 🚨 Troubleshooting

### SSH Connection Issues
```bash
# Test SSH connection
ssh -i ~/.ssh/staging_key staging_user@staging_host
ssh -i ~/.ssh/production_key production_user@production_host

# Check SSH key permissions
chmod 600 ~/.ssh/staging_key
chmod 600 ~/.ssh/production_key
```

### Docker Issues
```bash
# Check Docker status
sudo systemctl status docker

# Check Docker Compose
docker-compose --version

# Check available disk space
df -h
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Check nginx configuration
sudo nginx -t
```

## 📊 Monitoring

### GitHub Actions
- Monitor deployments in **Actions** tab
- Check logs for any errors
- Verify all secrets are properly set

### Server Monitoring
```bash
# Check application logs
docker-compose logs -f

# Check system resources
htop
df -h
free -h

# Check SSL certificate expiry
openssl x509 -in ssl/cert.pem -noout -dates
```

## 🔄 Environment Variables

Create `.env.production` file on production server:

```bash
# Database
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name

# Security
JWT_KEY=your_production_jwt_key
COOKIE_KEY=your_production_cookie_key

# Environment
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth
GOOGLE_API_KEY=your_google_api_key
GH_CLIENT_ID=your_github_client_id
GH_CLIENT_SECRET=your_github_client_secret
```

## 🎯 Best Practices

1. **Use different SSH keys** for staging and production
2. **Rotate secrets regularly** for security
3. **Monitor deployments** and set up alerts
4. **Test in staging** before production deployment
5. **Keep backups** of environment files
6. **Use strong passwords** and keys
7. **Monitor SSL certificate expiry**
8. **Set up log rotation** for production servers 