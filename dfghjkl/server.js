// Production-ready zero-dependency HTTP server for SOUL ERP Portal
// Configured for local development & cloud hosting on Render
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0'; // Essential for Render to bind external traffic
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json'
};

const server = http.createServer((req, res) => {
  // Normalize request path
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Health check endpoint for Render monitoring and zero-downtime deploys
  if (reqPath === '/healthz' || reqPath === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }));
  }

  // Default to index.html for root
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check: ensure path is strictly within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden: Access denied');
  }

  // Check file status
  fs.stat(filePath, (err, stats) => {
    // If file doesn't exist and has no extension, fallback to index.html for SPA routing
    if ((err || !stats.isFile()) && !path.extname(reqPath)) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
      fs.stat(filePath, (fallbackErr, fallbackStats) => {
        if (fallbackErr || !fallbackStats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('404 Not Found');
        }
        serveFile(res, filePath, '.html');
      });
      return;
    }

    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    serveFile(res, filePath, ext);
  });
});

function serveFile(res, filePath, ext) {
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Cache headers: short cache for html, longer for static assets
  const cacheControl = ext === '.html'
    ? 'no-cache, must-revalidate'
    : 'public, max-age=86400';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  });

  const stream = fs.createReadStream(filePath);
  stream.on('error', (streamErr) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('500 Internal Server Error');
  });
  stream.pipe(res);
}

server.listen(PORT, HOST, () => {
  console.log(`\n======================================================`);
  console.log(`  SOUL Radiology ERP Portal is live on Render!`);
  console.log(`  Host: ${HOST}`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Health Check: http://${HOST}:${PORT}/healthz`);
  console.log(`======================================================\n`);
});

// Graceful shutdown handling for Render zero-downtime redeployments
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} signal received: closing HTTP server...`);
  server.close(() => {
    console.log('HTTP server closed cleanly. Exiting process.');
    process.exit(0);
  });
  // Force exit after 5 seconds if connections hang
  setTimeout(() => {
    console.error('Forcefully terminating lingering connections.');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
