const http = require('http');
const queryString = require('querystring');

const database = {
  products: ['Product 1', 'Product 2'],
  session: {}
};

const parseCookie = (req) => {
  const cookies = (req.headers.cookie || "").split(';');
  const cookieObj = {};
  cookies.forEach(cookie => {
    const [sid, sessionId, value] = cookie.trim().split('=');
    cookieObj[decodeURIComponent(sid)] = decodeURIComponent(sessionId + '=' + value)
  });

  return cookieObj;
}

const login = (req, res) => {
  const createSession = () => `session-id=${Date.now()}`;
  const findUser = () => ({
    name: `alice`,
    email: `alice@email.com`
  });

  const sid = createSession();
  const user = findUser();

  database.session = {
    [sid]: user
  };
  res.statusCode = 301;
  res.setHeader('Location', '/');
  res.setHeader('Set-Cookie', `sid=${sid} HttpOnly=true;`);
  res.end();
}

const logout = (req, res) => {
  const sid = parseCookie(req)['sid'] || '';
  delete database.session[sid]
  res.statusCode = 301;
  res.setHeader('Location', '/');
  res.setHeader('Set-Cookie', 'sid=;Max-Age=-1;');
  res.end();
}

const postProduct = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body = body + chunk;
  });

  req.on('end', () => {
    const { product } = queryString.parse(body);
    // const excapedProduct = product.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // database.products.push(excapedProduct);
    database.products.push(product);
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  });

}

const report = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body = body + chunk.toString();
  });

  req.on('end', () => {
    const report = JSON.parse(body);

    console.log('CSP Report:', report);
    res.end();
  })
}

const index = (req, res) => {
  const sid = parseCookie(req)['sid'] || '';
  const userAccount = database.session[sid] || '';

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Security-Policy', 'default-src "self"');
  res.setHeader('Content-Security-Policy-Report-Only', 'default-src "self"; report-uri /report');
  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
      <style>input {width: 600px;}</style>
      <style>
        @font-face {
          font-family: 'MyCustomFont';
          src: url('http://other-origin.com/MyCustomFont.worf2');
        }
      </style>
      <head>
      <body style="font-family: 'MyCustomFont'">
      ${userAccount ? `${userAccount.name}, ${userAccount.email}` : `Guest`}
        <form method='POST' action='/product'>
          <input name='product' type='text'/>
          <button type='submit'>Add</button>
        </form>
        <ul>
          ${database.products.map(product => `<li>${product}</li>`).join('')}
        </ul>
      </body>
    </html>
    `);
  res.end();
}

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  console.log(pathname);
  if (pathname === '/login') return login(req, res);
  if (pathname === '/logout') return logout(req, res);
  if (pathname === '/product') return postProduct(req, res);
  if (pathname === '/report') return report(req, res);
  
  index(req, res);
}

const server = http.createServer(handler);
server.listen(3000, () => console.log('server is running ::3000'));