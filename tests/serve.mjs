import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const types = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  ico: 'image/x-icon',
  pdf: 'application/pdf',
};

createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = pathname === '/sina/' ? 'index.html' : pathname.slice('/sina/'.length);
  const type = types[file.split('.').at(-1)];
  if (!pathname.startsWith('/sina/') || !/^[\w/-]+\.[a-z]+$/.test(file) || !type) {
    res.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(new URL(`../${file}`, import.meta.url));
    res.writeHead(200, { 'Content-Type': type }).end(content);
  } catch {
    res.writeHead(404).end();
  }
}).listen(4173, '127.0.0.1');
