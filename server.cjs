const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Favicon direct guarantee
  if (reqPath === '/favicon.ico') {
    const faviconPath = path.join(__dirname, 'assets', 'images', 'logo.png');
    fs.readFile(faviconPath, (err, data) => {
      if (!err && data) {
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': data.length,
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        });
        res.end(data);
        return;
      }
    });
    return;
  }

  // Strip leading slashes to prevent Windows root-drive resolution
  let relativePath = decodeURIComponent(reqPath).replace(/^[\\\/]+/, '');

  // Route HTML files to cream counterparts if present
  if (relativePath.endsWith('.html') || !path.extname(relativePath)) {
    if (!relativePath.endsWith('.html')) {
      relativePath += '.html';
    }
    const base = relativePath.replace(/\.cream\.html$/i, '').replace(/\.html$/i, '');
    const creamCandidate = path.join(__dirname, `${base}.cream.html`);
    if (fs.existsSync(creamCandidate)) {
      relativePath = `${base}.cream.html`;
    }
  }

  const filePath = path.join(__dirname, relativePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`[404] ${req.url} -> ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>404 Not Found</h1><p>Requested: ${req.url}</p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        console.error(`[500] Read error for ${filePath}:`, readErr);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      // Dynamic HTML Sanitizer
      if (contentType.startsWith('text/html')) {
        let html = data.toString('utf8');
        // Strip craft-section (Uncompromising Standards / Four Tenets)
        html = html.replace(/<section class="craft-section"[\s\S]*?<\/section>/gi, '');
        // Strip bespoke-section (Private Commissions)
        html = html.replace(/<section class="bespoke-section"[\s\S]*?<\/section>/gi, '');
        // Ensure responsive-shield.css is included
        if (!html.includes('responsive-shield.css')) {
          html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/responsive-shield.css?v=6.0">\n</head>');
        }
        // Ensure mobile-nav.js is included
        if (!html.includes('mobile-nav.js')) {
          html = html.replace('</body>', '  <script src="assets/js/mobile-nav.js?v=6.0"></script>\n</body>');
        }
        data = Buffer.from(html, 'utf8');
      }

      // Dynamic JS Sanitizer for mobile-nav.js to prevent any revert or lock
      if (relativePath.includes('mobile-nav.js')) {
        let jsContent = data.toString('utf8');
        if (jsContent.includes('links[i].addEventListener(\'click\', closeNav)')) {
          jsContent = jsContent.replace('links[i].addEventListener(\'click\', closeNav);', '// link click interception permanently excised');
        }
        data = Buffer.from(jsContent, 'utf8');
      }

      console.log(`[200] ${req.url} -> ${path.basename(filePath)} (${data.length} bytes)`);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': data.length,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Royal Decaux server running at http://localhost:${PORT}`);
});

