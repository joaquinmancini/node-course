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
  });

  return mongoose.model("Token", TokenSchema);
  
};