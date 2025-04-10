const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');
const static = require('../shared/serve-static');
const Message = require('../shared/message');

let webSocketClients = [];


const handler = (req, res) => {
  // todo
  static(path.join(__dirname, '/public'))(req, res);
}

const server = http.createServer(handler);
server.listen(3000, () => console.log('server is running ::3000'))

const wws = new WebSocketServer({ server });

wws.on('connection', ws => {

  const message = new Message('서버와 연결되었습니다.');
  ws.send(`${message}`);

  webSocketClients.push(ws);

  ws.on('message', data => {
    for (const webSocketClient of webSocketClients) {
      const text = `${webSocketClient === ws ? "me:" : "other: "} ${data.toString('utf-8')}`
      const message = new Message(text);
      webSocketClient.send(`${message}`);
    }
  })
});