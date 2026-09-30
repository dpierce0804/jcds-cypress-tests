import http from 'node:http';
import { readFile } from 'node:fs/promises';
const page = await readFile(new URL('./index.html', import.meta.url));
http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(page);
  }
  res.writeHead(404); res.end('Not found');
}).listen(4173, '127.0.0.1', () => console.log('Demo: http://127.0.0.1:4173'));
