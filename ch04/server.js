const http = require("http");

const handler = (req, res) => {
  const cookie = req.headers["cookie"];

  if (cookie && cookie.includes("sid")) {
    res.write('Welcome again. \n');
    res.end();
    return;
  }

  // res.setHeader("Set-Cookie", "sid=1; Domain=mysite.com");
  // res.setHeader("Set-Cookie", "sid=1; Path=/private");
  // res.setHeader("Set-Cookie", "sid=1; Max-Age=10"); // Max-Age = 초단위 쿠키 유지 기간, Expires = 일자 단위 쿠키 유지 기간
  res.setHeader("Set-Cookie", "sid=1; Secure"); // 클라이언트가 HTTPS를 사용할때만 쿠키를 보내도록 하는 쿠키 디렉티브
  res.write("Welcome");
  res.end();
}

const server = http.createServer(handler);
server.listen(3000, console.log(`Listening on port 3000`));

