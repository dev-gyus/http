const http = require("http");
const path = require("path");
const fs = require("fs");

const statics = (req, res) => {
  const filepath = path.join(__dirname, "public", req.url);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.write("Not found\n");
      res.end();
      return;
    }
    res.write(data);
    res.end();
  });
}

const handler = (req, res) => statics(req, res);

const server = http.createServer(handler);
server.listen(3000, () => console.log(`Listening on port`));
