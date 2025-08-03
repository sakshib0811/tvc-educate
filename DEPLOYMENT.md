# 🚀 Production Deployment Guide

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PM2 (for process management)
- SSL certificates
- MongoDB Atlas account
- Cloudinary account

## 🔧 Environment Setup

### 1. Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**server/.env:**
```bash
# Database
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
DB_NAME=your_database_name

# Security
JWT_KEY=your_jwt_secret_key
COOKIE_KEY=your_cookie_secret_key

# Environment
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth (Optional)
GOOGLE_API_KEY=your_google_api_key
GH_CLIENT_ID=your_github_client_id
GH_CLIENT_SECRET=your_github_client_secret
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
```

**client/.env:**
```bash
REACT_APP_BASE_URL=https://yourdomain.com/api
REACT_APP_SOCKET_IO_URL=https://yourdomain.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_FB_APP_ID=your_facebook_app_id
```

## 🐳 Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Manual Docker Build

```bash
# Build the image
docker build -t tvc-educate .

# Run the container
docker run -d \
  --name tvc-educate-server \
  -p 5000:5000 \
  --env-file server/.env \
  tvc-educate
```

## 📦 PM2 Deployment

### 1. Install PM2

```bash
npm install -g pm2
```

### 2. Start with PM2

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# View logs
pm2 logs tvc-educate-server
```

### 3. PM2 Commands

```bash
# Restart application
pm2 restart tvc-educate-server

# Stop application
pm2 stop tvc-educate-server

# Delete application
pm2 delete tvc-educate-server

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🔒 SSL/HTTPS Setup

### 1. Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to nginx
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
```

### 2. Self-Signed Certificate (Development)

```bash
# Create SSL directory
mkdir ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem
```

## 📊 Monitoring and Logging

### 1. Health Check

```bash
# Check application health
curl https://yourdomain.com/health
```

### 2. View Logs

```bash
# PM2 logs
pm2 logs tvc-educate-server

# Docker logs
docker-compose logs server

# Application logs
tail -f server/logs/all.log
tail -f server/logs/error.log
```

### 3. Performance Monitoring

```bash
# Monitor with PM2
pm2 monit

# Check memory usage
pm2 show tvc-educate-server
```

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd server && npm ci
        cd ../client && npm ci
        
    - name: Build client
      run: cd client && npm run build:prod
      
    - name: Deploy to server
      run: |
        # Add your deployment commands here
        # Example: rsync, scp, or cloud deployment
```

## 🚨 Backup Strategy

### 1. Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/database" --out=./backups/$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/database" ./backups/20231201/
```

### 2. Automated Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/$DATE"

mkdir -p $BACKUP_DIR

# Database backup
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR/db

# Application backup
tar -czf $BACKUP_DIR/app.tar.gz server/ client/

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR s3://your-bucket/backups/ --recursive

echo "Backup completed: $BACKUP_DIR"
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

2. **MongoDB connection failed**
   ```bash
   # Check MongoDB status
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **SSL certificate issues**
   ```bash
   # Check certificate validity
   openssl x509 -in ssl/cert.pem -text -noout
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

### Performance Optimization

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Monitor memory usage**
5. **Optimize database queries**

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale PM2 instances
pm2 scale tvc-educate-server 4

# Load balancer configuration
# Use nginx or cloud load balancer
```

### Vertical Scaling

```bash
# Increase memory limit
pm2 restart tvc-educate-server --max-memory-restart 2G
```

## 🔐 Security Checklist

- [ ] SSL/HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Input sanitization active
- [ ] Security headers set
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting active

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs` or `docker-compose logs`
2. Verify environment variables
3. Test health endpoint: `/health`
4. Check database connectivity
5. Review security configurations 