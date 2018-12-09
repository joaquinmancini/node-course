module.exports = (mongoose) => {
  
  const TaskSchema = new mongoose.Schema({
    name: {
      type: String,
      required: "Task name is mandatory"
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["pending", "doing", "completed"],
      default: "pending"
    }
  });

  return mongoose.model("Task", TaskSchema);
  
};