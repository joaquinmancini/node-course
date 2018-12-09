const fs = require("fs"),
  express = require("express"),
  app = express();

function logRequest(req) {
  const logFile = `${__dirname}/requests.log`,
    data = {
      url: req.url,
      headers: req.headers,
      ip: req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    };

  fs.appendFile(logFile, `${JSON.stringify(data, null, 2)}\n`, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Request data written to ${logFile}`);
    }
  });

  return data;
}

function noAnswer(req) {
  console.log(`I'm not going to answer to: ${req.url}`);
}

function noFavicon(res) {
  console.log("Asked for favicon.ico and I will response with 404!");
  res.sendStatus(404);
}

app.use((req, res, next) => {
  if (req.url === "/none") {
    noAnswer(req);
  } else if (req.url === "/favicon.ico") {
    noFavicon(res);
  } else {
    res.logData = logRequest(req);
    next();
  }
});

app.get("*", (req, res) => {
  console.log("Log data is:", res.logData);
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("App listening on port 8000!");
});