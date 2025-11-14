const http = require('http');

const port = process.env.PORT ? Number(process.env.PORT) : 3131;
const hostname = process.env.HOSTNAME || '0.0.0.0';
const path = '/healthz';

const req = http.get({ 
  hostname: hostname === '0.0.0.0' ? 'localhost' : hostname, 
  port, 
  path, 
  timeout: 5000 
}, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    console.error(`Health check failed: status ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.error('Health check error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  console.error('Health check timeout');
  process.exit(1);
});