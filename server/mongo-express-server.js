const { spawn } = require('child_process');
const path = require('path');

console.log('🗄️  Starting Mongo Express...');
console.log('🌐 MongoDB UI will be at http://localhost:8081');
console.log('👤 Username: admin');
console.log('🔑 Password: admin123');
console.log('');

// Set environment variables
const env = {
  ...process.env,
  ME_CONFIG_MONGODB_URL: 'mongodb://localhost:27017',
  ME_CONFIG_MONGODB_ENABLE_ADMIN: 'true',
  ME_CONFIG_BASICAUTH_USERNAME: 'admin',
  ME_CONFIG_BASICAUTH_PASSWORD: 'admin123',
  ME_CONFIG_SITE_BASEURL: '/',
  VCAP_APP_PORT: '8081'
};

// Run mongo-express directly
const mongoExpressPath = path.join(__dirname, 'node_modules', 'mongo-express', 'app.js');
const mongoExpress = spawn('node', [mongoExpressPath], { env, stdio: 'inherit' });

mongoExpress.on('error', (err) => {
  console.error('Failed to start Mongo Express:', err);
});

process.on('SIGINT', () => {
  mongoExpress.kill();
  process.exit();
});
