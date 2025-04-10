const http = require('http');
const path = require('path');
const static = require('../shared/serve-static');
const Message = require('../shared/message');

let waitingClients = [];
let message = null;

const subscribe = (req, res) => {
  const lastEventId = req.headers['last-event-id']
  console.log('lastEventId', lastEventId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.write("\n");

  waitingClients.push(res);

  req.on('close', () => {
    waitingClients = waitingClients.filter(client => client !== res);
  });
}

const update = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body = body + chunk;
  });
  req.on('end', () => {
    const { text } = JSON.parse(body);
    if (!text) {
      res.statusCode = 408;
      res.write(JSON.stringify({
        error: 'text 필드를 채워주세요.'
      }));
      res.end();
    }
    message = new Message(text);

    for (const client of waitingClients) {
      client.write([
        `data: ${message}\n`,
        `retry: 10000\n`,
        `id: ${message.timestamp}\n\n` // last-event-id
      ].join(""));
      client.end();
    }
    res.setHeader('Content-Type', 'application/json');
    res.write(`${message}\n`);
    res.end();
  })
}

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === '/subscribe') return subscribe(req, res);
  if (pathname === '/update') return update(req, res);

  static(path.join(__dirname, '/public'))(req, res);
};
const server = http.createServer(handler);
server.listen(3000, () => {console.log('Server started on port 3000')});