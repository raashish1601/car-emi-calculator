# 🚀 AWS EC2 Deployment Guide - Car Loan EMI Calculator

This guide will help you deploy the Car Loan EMI Calculator on AWS EC2 using the **Free Tier** (12 months free).

## 📋 Prerequisites

1. **AWS Account** (Free Tier eligible)
2. **Credit Card** (for verification, won't be charged for Free Tier usage)
3. **Basic knowledge** of terminal/command line

## 🆓 AWS Free Tier Benefits

- **750 hours/month** of t2.micro EC2 instances (enough for 24/7 operation)
- **30 GB** of EBS storage
- **15 GB** of bandwidth out
- **1 year** free usage

## 🚀 Step-by-Step Deployment

### Step 1: Create AWS Account & Launch EC2 Instance

1. **Sign up for AWS** at [aws.amazon.com](https://aws.amazon.com)
2. **Navigate to EC2** in the AWS Console
3. **Click "Launch Instance"**
4. **Configure Instance:**
   - **Name**: `car-emi-calculator`
   - **AMI**: Ubuntu Server 22.04 LTS (Free Tier eligible)
   - **Instance Type**: t2.micro (Free Tier eligible)
   - **Key Pair**: Create new or use existing
   - **Security Group**: Create new with these rules:
     - SSH (22) - Your IP
     - HTTP (80) - Anywhere (0.0.0.0/0)
     - HTTPS (443) - Anywhere (0.0.0.0/0)
5. **Launch Instance**

### Step 2: Connect to Your EC2 Instance

1. **Get your EC2 Public IP** from the EC2 console
2. **Connect via SSH:**
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
   ```

### Step 3: Upload Project Files

**Option A: Using SCP (Recommended)**
```bash
# From your local machine
scp -i your-key.pem -r /path/to/car-emi-calculator ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/
```

**Option B: Using Git**
```bash
# On EC2 instance
git clone https://github.com/your-username/car-emi-calculator.git
cd car-emi-calculator
```

**Option C: Manual Upload**
1. Create a ZIP file of your project
2. Upload to EC2 using SCP or AWS S3

### Step 4: Run Deployment Script

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Step 5: Verify Deployment

1. **Check if services are running:**
   ```bash
   pm2 status
   sudo systemctl status nginx
   ```

2. **Access your application:**
   - Open browser and go to: `http://YOUR_EC2_PUBLIC_IP`
   - You should see the Car Loan EMI Calculator

## 🔧 Manual Configuration (If Script Fails)

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install Dependencies
```bash
cd /home/ubuntu/car-emi-calculator
npm install
npm run build
```

### Install PM2
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Install and Configure Nginx
```bash
sudo apt install nginx -y
sudo cp nginx.conf /etc/nginx/sites-available/car-emi-calculator
sudo ln -s /etc/nginx/sites-available/car-emi-calculator /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```

## 🔍 Troubleshooting

### Check Application Logs
```bash
pm2 logs car-emi-calculator
pm2 monit
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
pm2 restart car-emi-calculator
sudo systemctl restart nginx
```

### Check Port Usage
```bash
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80
```

## 💰 Cost Optimization

### Stay Within Free Tier
- **Use t2.micro instance only**
- **Monitor usage** in AWS Billing Dashboard
- **Stop instance** when not needed (saves hours)

### Stop/Start Instance
```bash
# Stop instance (saves money)
sudo shutdown -h now

# Start from AWS Console when needed
```

## 🔒 Security Best Practices

1. **Update Security Group** to restrict SSH access to your IP only
2. **Regular Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. **Firewall Configuration:**
   ```bash
   sudo ufw status
   ```

## 📊 Monitoring

### Application Monitoring
```bash
pm2 status
pm2 logs car-emi-calculator --lines 50
```

### System Monitoring
```bash
htop
df -h
free -h
```

## 🌐 Custom Domain (Optional)

1. **Buy a domain** from any registrar
2. **Point A record** to your EC2 public IP
3. **Update nginx.conf** with your domain name
4. **Restart nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

## 📱 SSL Certificate (Optional)

For HTTPS, you can use Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🎉 Success!

Your Car Loan EMI Calculator is now live on AWS EC2!

**Access URL:** `http://YOUR_EC2_PUBLIC_IP`

## 📞 Support

If you encounter any issues:
1. Check the logs using commands above
2. Verify all services are running
3. Check AWS Security Group settings
4. Ensure your EC2 instance is running

---

**Total Cost: $0/month** (within Free Tier limits) 🎉
