const https = require('https');
const path = require('path');
const fs = require('fs');

const options = {
  key: fs.readFileSync(path.join(__dirname, './server.key')),
  cert: fs.readFileSync(path.join(__dirname, './server.cert'))
}

const handler = (req, res) => {
  res.write("hello\n");
  res.end();
}

const server = https.createServer(options, handler);
const port = process.env.PORT || 3000
server.listen(port, () => console.log(`server is running ${port}`));