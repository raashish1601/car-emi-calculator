// Simple health check endpoint for monitoring
const express = require('express');
const app = express();
const PORT = 3001;

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});
