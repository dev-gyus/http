const http = require('http');
const path = require('path');
const static = require('../shared/serve-static');
const Message = require('../shared/message');

let waitingClients = [];
let message = null;

const longPoll = (req, res) => {
  const WAITING_TIMES_MS = 10000;

  if (!message) {
    waitingClients.push(res);
    setTimeout(() => {
      res.statusCode = 408;
      res.end();
    }, WAITING_TIMES_MS);
    return;
  }

  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json');
    res.write(`${message}\n`);
    res.end();
  }
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
    for (const client of waitingClients) {
      if (!client.headersSent) {
        client.setHeader('Content-Type', 'application/json');
        client.write(`${message}`);
        client.end();
      }
    }
    if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
        res.write(`${message}`);
        res.end();
    }
    message = null;
    waitingClients = [];
  });
}

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === '/longpoll') return longPoll(req, res);
  if (pathname === '/update') return update(req, res);

  static(path.join(__dirname, '/public'))(req, res);
};
const server = http.createServer(handler);
server.listen(3000, () => {console.log('Server started on port 3000')});