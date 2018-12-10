module.exports = (mongoose) => {
  
  const TokenSchema = new mongoose.Schema({
      token: {
        type: String,
        required: "Token is mandatory"
      },
      expireDate: {
        type: Date,
        required: "Expiration date is mandatory"
      },
      createdDate: {
        type: Date,
        default: Date.now
      }
    }),
    model = mongoose.model("Token", TokenSchema);

  model.isExpired = (token) => {
    return new Date() > new Date(token.expireDate);
  };

  model.findByValidToken = (token) => {
    return model.findOne({token})
      .then((t) => {
        return t && !model.isExpired(t) ? t : null;
      });
  };

  return model;
  
};