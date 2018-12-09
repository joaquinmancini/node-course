module.exports = (mongoose) => {
  
  return {
    Task: require("./task")(mongoose)
  };
  
};