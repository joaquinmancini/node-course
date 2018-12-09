const env = process.env.NODE_ENV || "dev",
  config = require(`./${env}`);

module.exports = config;
