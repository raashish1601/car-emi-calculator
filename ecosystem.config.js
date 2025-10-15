module.exports = {
  apps: [{
    name: 'car-emi-calculator',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/car-emi-calculator',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
