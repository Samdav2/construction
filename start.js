/**
 * Root process launcher for Railway monorepo deployments.
 *
 * Dynamically detects whether the service is intended to run as
 * the Web Frontend or API Backend, preventing the frontend container
 * from accidentally requiring backend environment variables (like MONGO_URI).
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const serviceName = (process.env.RAILWAY_SERVICE_NAME || process.env.SERVICE_NAME || '').toLowerCase();
const serviceType = (process.env.SERVICE_TYPE || process.env.APP || '').toLowerCase();

const isWeb = serviceType === 'web' ||
              serviceType === 'frontend' ||
              serviceName.includes('web') ||
              serviceName.includes('frontend') ||
              serviceName.includes('client');

if (isWeb) {
  const port = process.env.PORT || '3000';
  console.log(`🚀 [Launcher] Starting Cpro Hub Web Frontend (SPA) on port ${port}...`);

  const distPath = path.resolve(__dirname, 'apps/web/dist');
  if (!fs.existsSync(distPath)) {
    console.error(`❌ [Launcher] Error: "${distPath}" not found. Did the build step run?`);
    process.exit(1);
  }

  const serveProcess = spawn('npx', ['--yes', 'serve', '-s', 'apps/web/dist', '-l', port], {
    stdio: 'inherit',
    shell: true
  });

  serveProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  console.log('🚀 [Launcher] Starting Cpro Hub API Backend Engine...');
  require('./apps/api/dist/server.js');
}

