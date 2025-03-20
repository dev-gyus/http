const http = require('http');
const path = require('path');
const static = require('../shared/serve-static');

const loginHandler = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body = body + chunk.toString();
  });
  req.on('end', () => {
    const {email, password} = JSON.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";
    res.statusCode = authenticated ? 200 : 401;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({authenticated}));
    res.end();
  })
}

const handler = (req, res) => {
  const { pathname} = new URL(req.url, `http://${req.headers.host}`);
  if (pathname === '/login') {
    loginHandler(req, res);
    return;
  }
  static(path.join(__dirname, 'public'))(req, res);
};
const server = http.createServer(handler);
server.listen(3000, () => {console.log('Server started on port 3000 ')});