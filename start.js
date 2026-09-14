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

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

if (isWeb) {
  const port = parseInt(process.env.PORT || '3000', 10);
  const distPath = path.resolve(__dirname, 'apps/web/dist');
  const indexHtml = path.join(distPath, 'index.html');

  if (!fs.existsSync(distPath) || !fs.existsSync(indexHtml)) {
    console.error(`❌ [Launcher] Error: "${distPath}" not found. Did the build step run?`);
    process.exit(1);
  }

  const http = require('http');
  const server = http.createServer((req, res) => {
    // Health check endpoint for Railway
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', service: 'cprohub-web' }));
    }

    // Sanitize path to prevent directory traversal
    const urlPath = req.url.split('?')[0];
    let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    const filePath = path.join(distPath, safePath);

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': cacheControl
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // SPA Fallback: serve index.html for client-side routes
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        fs.createReadStream(indexHtml).pipe(res);
      }
    });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 [Launcher] Cpro Hub Web Frontend is live on port ${port}!`);
    console.log(`🌐 [Launcher] Serving production build from: ${distPath}`);
  });
} else {
  console.log('🚀 [Launcher] Starting Cpro Hub API Backend Engine...');
  require('./apps/api/dist/server.js');
}

