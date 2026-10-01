const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
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
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function resolveExistingFile(relativePath) {
  const searchBases = [
    __dirname,
    path.join(__dirname, 'public'),
    process.cwd(),
    path.join(process.cwd(), 'public')
  ];

  for (const base of searchBases) {
    const candidate = path.join(base, relativePath);
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch (e) {}
  }
  return null;
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Favicon direct guarantee
  if (reqPath === '/favicon.ico') {
    const faviconFile = resolveExistingFile('assets/images/logo.png');
    if (faviconFile) {
      const data = fs.readFileSync(faviconFile);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': data.length,
        'Cache-Control': 'public, max-age=86400, must-revalidate'
      });
      res.end(data);
      return;
    }
  }

  // Strip leading slashes to prevent Windows root-drive resolution
  let relativePath = decodeURIComponent(reqPath).replace(/^[\\\/]+/, '');

  // Route HTML files cleanly
  if (relativePath.endsWith('.html') || !path.extname(relativePath)) {
    if (!relativePath.endsWith('.html')) {
      relativePath += '.html';
    }
    const base = relativePath.replace(/\.cream\.html$/i, '').replace(/\.html$/i, '');
    const creamCandidate = resolveExistingFile(`${base}.cream.html`);
    if (creamCandidate) {
      relativePath = `${base}.cream.html`;
    }
  }

  const filePath = resolveExistingFile(relativePath);

  if (!filePath) {
    console.log(`[404] ${req.url} -> could not locate ${relativePath}`);
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family: sans-serif; text-align: center; padding: 3rem;"><h1>404 Not Found</h1><p>Requested: ${req.url}</p><a href="/" style="color: #0e244d; font-weight: bold;">Return to Royal Decaux Home</a></body></html>`);
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
      data = Buffer.from(html, 'utf8');
    }

    const isHtml = contentType.startsWith('text/html');
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length,
      'Cache-Control': isHtml
        ? 'no-store, no-cache, must-revalidate, max-age=0'
        : 'public, max-age=86400, must-revalidate'
    });
    res.end(data);
  });
});

if (require.main === module || !process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Royal Decaux server running at http://localhost:${PORT}`);
  });
}

module.exports = server;
