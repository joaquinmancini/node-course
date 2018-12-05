// Example from: https://nodejs.org/en/about/

const hostname = "127.0.0.1",
  port = 8000,
  http = require("http"),
  server = http.createServer((req, res) => {
    console.debug(`Incoming request at ${req.method} ${req.url}`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello world!");
  });

server.listen(port, hostname, () => {
  const url = `http://${hostname}:${port}/`;
  console.log(`Server running at ${url}`);

  // Verify that server is up!
  http.get(url, (resp) => {
    let data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      console.log(`RESPONSE: ${data}`);
    });

  }).on("error", (err) => {
    console.error(err);
  });
});