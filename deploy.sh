#!/bin/bash

# Car Loan EMI Calculator - AWS EC2 Deployment Script
# Run this script on your EC2 instance

echo "🚀 Starting Car Loan EMI Calculator Deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2 process manager..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /home/ubuntu/car-emi-calculator
sudo chown -R ubuntu:ubuntu /home/ubuntu/car-emi-calculator

# Navigate to application directory
cd /home/ubuntu/car-emi-calculator

# Copy application files (you'll need to upload your project files here)
echo "📁 Application files should be uploaded to /home/ubuntu/car-emi-calculator"

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/car-emi-calculator
sudo ln -s /etc/nginx/sites-available/car-emi-calculator /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Start services
echo "🚀 Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be accessible at: http://YOUR_EC2_PUBLIC_IP"
echo "📊 Check application status with: pm2 status"
echo "📋 View logs with: pm2 logs car-emi-calculator"
