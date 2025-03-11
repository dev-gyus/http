const http = require('http');
const path = require('path');
const querystring = require('querystring');
const static = require('../shared/serve-static');

const logRequest = (req) => {
  const log = [
    // 유저의 사용 시간을 알 수 있습니다.
    `${new Date().toISOString()}`,
    // 유저의 접속 지역을 알 수 있습니다.
    `IP: ${req.socket.remoteAddress || req.connection.remoteAddress}`,
    // 유저가 사용하는 단말기를 추정할 수 있습니다.
    `User-Agent: ${req.headers['user-agent']}`,
    // 사용자가 어떤 페이지를 보는지 알 수 있습니다.
    `Referer: ${req.headers['referer']}`,
  ].join(', ');
  console.log(log);
}

const getLogin = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const email = searchParams.get('email');
  const password = searchParams.get('password');

  const authenticated = email === "myemail" && password === "mypassword";

  if (!authenticated) {
    res.statusCode = 401;
    res.write('Unauthorized\n');
    res.end();
    return;
  }
  res.write('Success\n');
  res.end();
}

const postLogin = (req, res) => {
  let body = "";
  req.on('data', chunk => {
    body = body + chunk.toString();
  })

  req.on('end', () => {
    const {email, password} = querystring.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";
    if (!authenticated) {
      res.statusCode = 401;
      res.write('Unauthorized\n');
      res.end();
      return;
    }
    res.write('Success\n');
    res.end();
  });
}

const handler = (req, res) => {
  const { pathname} = new URL(req.url, `http://${req.headers.host}`);
  if (pathname === '/tracking-pixel.jpg') {
    logRequest(req);
  }
  if (pathname === '/login') {
    // return getLogin(req, res);
    return postLogin(req, res);
  }
  static(path.join(__dirname, 'public'))(req, res);
};
const server = http.createServer(handler);
server.listen(3000, () => {console.log('Server started on port 3000')});