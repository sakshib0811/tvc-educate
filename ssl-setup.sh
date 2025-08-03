#!/bin/bash

# SSL Certificate Setup Script for TVC Educate
# This script automates the SSL certificate setup using Let's Encrypt

set -e

# Configuration
DOMAIN=${1:-"yourdomain.com"}
EMAIL=${2:-"admin@yourdomain.com"}
SSL_DIR="./ssl"
NGINX_CONF="./nginx.conf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 SSL Certificate Setup for TVC Educate${NC}"
echo -e "${YELLOW}Domain: $DOMAIN${NC}"
echo -e "${YELLOW}Email: $EMAIL${NC}"

# Check if domain is provided
if [ "$DOMAIN" = "yourdomain.com" ]; then
    echo -e "${RED}❌ Please provide your domain name as the first argument${NC}"
    echo -e "${YELLOW}Usage: ./ssl-setup.sh yourdomain.com admin@yourdomain.com${NC}"
    exit 1
fi

# Create SSL directory
echo -e "${GREEN}📁 Creating SSL directory...${NC}"
mkdir -p $SSL_DIR

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Certbot...${NC}"
    
    # Detect OS and install certbot
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            # Ubuntu/Debian
            sudo apt-get update
            sudo apt-get install -y certbot
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            sudo yum install -y certbot
        else
            echo -e "${RED}❌ Unsupported Linux distribution${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install certbot
        else
            echo -e "${RED}❌ Please install Homebrew first: https://brew.sh/${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Unsupported operating system${NC}"
        exit 1
    fi
fi

# Stop nginx if running (to free port 80)
echo -e "${YELLOW}🛑 Stopping nginx if running...${NC}"
if command -v nginx &> /dev/null; then
    sudo systemctl stop nginx 2>/dev/null || true
fi

# Stop docker containers if running
echo -e "${YELLOW}🛑 Stopping docker containers...${NC}"
docker-compose down 2>/dev/null || true

# Get SSL certificate
echo -e "${GREEN}🔐 Obtaining SSL certificate from Let's Encrypt...${NC}"
sudo certbot certonly --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    --non-interactive

# Copy certificates to project directory
echo -e "${GREEN}📋 Copying certificates to project directory...${NC}"
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem

# Set proper permissions
sudo chown $USER:$USER $SSL_DIR/cert.pem $SSL_DIR/key.pem
chmod 600 $SSL_DIR/cert.pem $SSL_DIR/key.pem

# Update nginx configuration with domain
echo -e "${GREEN}⚙️  Updating nginx configuration...${NC}"
sed -i.bak "s/server_name _;/server_name $DOMAIN;/g" $NGINX_CONF

# Create renewal script
echo -e "${GREEN}📝 Creating certificate renewal script...${NC}"
cat > renew-ssl.sh << EOF
#!/bin/bash
# SSL Certificate Renewal Script

echo "🔄 Renewing SSL certificate for $DOMAIN..."

# Stop nginx
sudo systemctl stop nginx 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Renew certificate
sudo certbot renew --quiet

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem

# Set permissions
sudo chown \$USER:\$USER $SSL_DIR/cert.pem $SSL_DIR/key.pem
chmod 600 $SSL_DIR/cert.pem $SSL_DIR/key.pem

# Restart services
docker-compose up -d 2>/dev/null || true

echo "✅ SSL certificate renewed successfully!"
EOF

chmod +x renew-ssl.sh

# Create cron job for automatic renewal
echo -e "${GREEN}⏰ Setting up automatic renewal...${NC}"
CRON_JOB="0 12 * * * $(pwd)/renew-ssl.sh >> $(pwd)/ssl-renewal.log 2>&1"

# Add to crontab if not already present
if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo -e "${GREEN}✅ Added automatic renewal to crontab${NC}"
else
    echo -e "${YELLOW}⚠️  Renewal cron job already exists${NC}"
fi

# Test certificate
echo -e "${GREEN}🧪 Testing SSL certificate...${NC}"
if openssl x509 -in $SSL_DIR/cert.pem -text -noout | grep -q "Subject:"; then
    echo -e "${GREEN}✅ SSL certificate is valid!${NC}"
    echo -e "${GREEN}📅 Expires: $(openssl x509 -in $SSL_DIR/cert.pem -noout -dates | grep notAfter | cut -d= -f2)${NC}"
else
    echo -e "${RED}❌ SSL certificate validation failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 SSL setup completed successfully!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "   1. Update your .env files with the correct domain"
echo -e "   2. Run: docker-compose up -d"
echo -e "   3. Test your site at: https://$DOMAIN"
echo -e "   4. Certificate will auto-renew every 60 days" 