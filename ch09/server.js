const http = require('http');
const path = require('path');
const static = require('../shared/serve-static');

class Message {
  constructor(text) {
    this.text = text;
    this.timestamp = Date.now();
  }

  toString() {
    return JSON.stringify({
      text: this.text,
      timestamp: this.timestamp
    })
  }
}

let message = null;

const poll = (req, res) => {
  if (!message) {
    res.statusCode = 204;
    res.end();
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.write(`${message}\n`);
  res.end();

  message = null;
}

const update = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body = body + chunk;
  });
  req.on('end', () => {
    const { text } = JSON.parse(body);
    if (!text) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify({
        error: 'text 필드를 채워주세요'
      }));
      res.end();
    }

    message = new Message(text);
    res.setHeader('Content-Type', 'application/json');
    res.write(`${message}`);
    res.end();
  });
}

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === '/poll') return poll(req, res);
  if (pathname === '/update') return update(req, res);

  static(path.join(__dirname, '/public'))(req, res);
};
const server = http.createServer(handler);
server.listen(3000, () => {console.log('Server started on port 3000')});