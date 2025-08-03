# 🚀 Quick Start Guide - SSL & CI/CD Setup

## 🔒 SSL Certificate Setup

### Option 1: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x ssl-setup.sh

# Run SSL setup (replace with your domain and email)
./ssl-setup.sh yourdomain.com admin@yourdomain.com
```

### Option 2: Manual Setup

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem

# Set permissions
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
chmod 600 ssl/cert.pem ssl/key.pem
```

## 🔄 CI/CD Pipeline Setup

### Step 1: Generate SSH Keys

```bash
# Generate keys for staging and production
ssh-keygen -t rsa -b 4096 -C "staging@yourdomain.com" -f ~/.ssh/staging_key
ssh-keygen -t rsa -b 4096 -C "production@yourdomain.com" -f ~/.ssh/production_key
```

### Step 2: Add Public Keys to Servers

```bash
# Add to staging server
ssh-copy-id -i ~/.ssh/staging_key.pub staging_user@staging_host

# Add to production server
ssh-copy-id -i ~/.ssh/production_key.pub production_user@production_host
```

### Step 3: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret | Value |
|--------|-------|
| `STAGING_SSH_KEY` | Content of `~/.ssh/staging_key` |
| `PRODUCTION_SSH_KEY` | Content of `~/.ssh/production_key` |
| `STAGING_HOST` | Your staging server IP |
| `STAGING_USER` | SSH username for staging |
| `PRODUCTION_HOST` | Your production server IP |
| `PRODUCTION_USER` | SSH username for production |
| `DOMAIN` | Your domain (e.g., `yourdomain.com`) |
| `ADMIN_EMAIL` | Your admin email |

### Step 4: Server Setup

#### On Staging Server:
```bash
sudo mkdir -p /opt/tvc-educate
sudo chown $USER:$USER /opt/tvc-educate
cd /opt
git clone https://github.com/yourusername/tvc-educate.git
cd tvc-educate
cp .env.example .env.staging
# Edit .env.staging with staging values
```

#### On Production Server:
```bash
sudo mkdir -p /opt/tvc-educate
sudo chown $USER:$USER /opt/tvc-educate
cd /opt
git clone https://github.com/yourusername/tvc-educate.git
cd tvc-educate
cp .env.example .env.production
# Edit .env.production with production values
chmod +x ssl-setup.sh
```

## 🚀 Deploy

### Staging Deployment
```bash
# Push to develop branch
git push origin develop
```

### Production Deployment
```bash
# Push to main branch
git push origin main
```

## ✅ Verify Deployment

### Check Staging
```bash
curl http://staging_host/health
```

### Check Production
```bash
curl https://yourdomain.com/health
```

## 🔧 Troubleshooting

### SSL Issues
```bash
# Check certificate
openssl x509 -in ssl/cert.pem -text -noout

# Renew manually
sudo certbot renew

# Check nginx config
sudo nginx -t
```

### Deployment Issues
```bash
# Check GitHub Actions logs
# Go to Actions tab in your repository

# Check server logs
docker-compose logs -f

# Check SSH connection
ssh -i ~/.ssh/production_key production_user@production_host
```

## 📊 Monitor

### GitHub Actions
- Monitor in **Actions** tab
- Check for failed deployments
- Review security scan results

### Server Monitoring
```bash
# Check application status
docker-compose ps

# Check system resources
htop
df -h

# Check SSL expiry
openssl x509 -in ssl/cert.pem -noout -dates
```

## 🎯 Production Checklist

- [ ] SSL certificate installed and working
- [ ] GitHub secrets configured
- [ ] Servers set up with SSH access
- [ ] Environment files created
- [ ] Test deployment to staging
- [ ] Test deployment to production
- [ ] Health checks passing
- [ ] SSL certificate auto-renewal working
- [ ] Monitoring and alerts set up

## 📞 Support

If you encounter issues:

1. Check the detailed guides in `DEPLOYMENT.md` and `GITHUB_SECRETS.md`
2. Review GitHub Actions logs
3. Check server logs with `docker-compose logs`
4. Verify SSH connections
5. Test SSL certificate manually

## 🔄 Auto-Renewal

SSL certificates will auto-renew every 60 days via cron job. Check renewal logs:

```bash
tail -f ssl-renewal.log
``` 