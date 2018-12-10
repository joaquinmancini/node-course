module.exports = (mongoose) => {

  const Token = mongoose.model("Token"),
    publicPaths = [
      "GET /api/token",
      "POST /api/token"
    ];

  return (req, res, next) => {
    const dontAuth = publicPaths.find((path) => {
      return path === `${req.method} ${req.url}`;
    });

    if (dontAuth) {
      return next();
    }

    return Token.findByValidToken(req.headers.token)
      .then((token) => {
        if (token) {
          next();
        } else {
          throw new Error("Token expired or not found!");
        }
      })
      .catch(() => {
        res.status(401).json({status: "error", message: "Unauthorized"});
      });
  };
};
