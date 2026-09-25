// node serve.mjs [puerto]  ->  servidor estático local para revisar el sitio (no se usa en producción).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2] || process.env.PORT || 4390);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

http.createServer(async (req, res) => {
  const send404 = async () => { res.writeHead(404, { 'Content-Type': types['.html'] }); res.end(await readFile(join(root, '404.html'))); };
  try {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/\\/g, '/');
    if (path.includes('..') || /(^|\/)\.|\.(mjs|md|log)$|^\/(data|docs|node_modules)(\/|$)/i.test(path)) return send404();
    let file = join(root, path);
    if ((await stat(file).catch(() => null))?.isDirectory()) {
      if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' }); return res.end(); }
      file = join(file, 'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { await send404(); }
}).listen(port, '127.0.0.1', () => console.log(`nombres.com.py local: http://127.0.0.1:${port}/`));
