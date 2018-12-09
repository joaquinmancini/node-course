module.exports = (mongoose) => {
  
  return {
    Task: require("./task")(mongoose),
    Token: require("./token")(mongoose)
  };
  
};