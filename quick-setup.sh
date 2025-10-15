#!/bin/bash

# Quick Setup Script for Car Loan EMI Calculator
# Run this on your EC2 instance after uploading files

echo "🚀 Quick Setup for Car Loan EMI Calculator..."

# Update system
sudo apt update

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install project dependencies
npm install

# Build the project
npm run build

# Install Nginx
sudo apt install nginx -y

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/car-emi-calculator
sudo ln -s /etc/nginx/sites-available/car-emi-calculator /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Setup complete!"
echo "🌐 Your app should be available at: http://YOUR_EC2_PUBLIC_IP"
echo "📊 Check status: pm2 status"
