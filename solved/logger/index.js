const http = require("http"),
  fs = require("fs"),
  file = `${__dirname}/requests.log`;

function transformDataObjectToJson(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

function logRequest(json) {
  fs.appendFile(file, json, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Request data written to ${file}`);
    }
  });
}

http.createServer((req, res) => {
  const data = {
      url: req.url,
      headers: req.headers,
      ip: req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    },
    json = transformDataObjectToJson(data);

  console.log(`Request received for ${req.url}`);
  logRequest(json);
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(json);
  console.log("Response sent!");
}).listen(8000);