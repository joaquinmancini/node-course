module.exports = (mongoose, config) => {

  const Token = mongoose.model("Token"),
    crypto = require("crypto");
  
  function isExpired(token) {
    return new Date() > new Date(token.expireDate);
  }

  function generate(req, res) {
    const data = {
      token: crypto.randomBytes(30).toString("hex"),
      expireDate: new Date(new Date().getTime() + config.tokenExpireMins * 60000)
    };

    Token.create(data)
      .then((token) => {
        res.response200(token, "Token successfully generated.");
      })
      .catch((err) => {
        res.response500(err, "Token couldn't be generated!");
      });
  }

  function read(req, res) {
    Token.findOne({token: req.headers.token})
      .then((token) => {
        if (token && !isExpired(token)) {
          res.response200(token.expireDate, "Token found.");
        } else {
          res.response200(null, "Token expired or not found!");
        }
      })
      .catch((err) => {
        res.response500(err, "Token couldn't be found!");
      });
  }
  
  return {
    generate,
    read
  };
  
};