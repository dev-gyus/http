const http = require('http');
const path = require('path');
const static = require('../shared/serve-static');

const chunk = async (req, res) => {
  const totalChunks = 5;
  const delayMs = 1000;
  const chunkSize = 8;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', totalChunks * chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    res.write(`chunk+${i}\n`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  res.end();
}

const upload = (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write("success");
  res.end();
}

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === '/chunk') return chunk(req, res);
  if (pathname === '/upload') return upload(req, res);
  static(path.join(__dirname, 'public'))(req, res);
};
const server = http.createServer(handler);
server.listen(3000, () => {console.log('Server started on port 3000')});