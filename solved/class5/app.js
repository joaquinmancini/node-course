const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  helmet = require("helmet"),
  mongoose = require("mongoose"),
  config = require("./config");

// Keep the config and mongoose inside app so it could be accessed inside it, anywhere
app.set("config", config);
app.set("mongoose", mongoose);

// Give our app support to parse JSON data on form POST requests and make it available at req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());

// Add utils middleware to append some helpers functions to response object
app.use(require("./lib/utils"));

// Setup mongoose and load models
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {useNewUrlParser: true});
require("./models")(mongoose);

// Register the routes and mount them all at /api
app.use("/api", require("./routes")(app, express.Router()));

app.use((req, res) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

app.listen(config.port, () => {
  console.log(`todo-list-api listening on port ${config.port}!`);
});

module.exports = app;
