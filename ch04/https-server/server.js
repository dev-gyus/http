const http = require("http");
const fs = require("fs");
const path = require("path");

const handler = (req, res) => {
  const cookie = req.headers["cookie"];

  if (cookie && cookie.includes("sid")) {
    res.write('Welcome again. \n');
    res.end();
    return;
  }

  // res.setHeader("Set-Cookie", "sid=1; Domain=mysite.com;");
  // res.setHeader("Set-Cookie", "sid=1; Path=/private;");
  // res.setHeader("Set-Cookie", "sid=1; Max-Age=10;"); // Max-Age = 초단위 쿠키 유지 기간, Expires = 일자 단위 쿠키 유지 기간
  // res.setHeader("Set-Cookie", "sid=1; Secure;"); // 클라이언트가 HTTPS를 사용할때만 쿠키를 보내도록 하는 디렉티브
  // 클라이언트가 HTTP로 요청을 보낼때만 쿠키를 같이 보내도록 하는 디렉티브 (클라이언트에서 js를 통해 쿠키 변조를 하지 못하도록 막는 방법)
  // 쿠키 확인 = document.cookie / 변조 = document.cookie = {name}={value}
  res.setHeader("Set-Cookie", "sid=1; HttpOnly;");
  res.write("Welcome");
  res.end();
}

// https 요청 처리를 위한 인증서, 키 관련 객체
const options = {
  key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
}

// https 요청 처리가 가능한 서버 객체 생성
const server = http.createServer(options, handler);
server.listen(3000, () => console.log(`Listening on port 3000`));

