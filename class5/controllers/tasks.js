function response200(res, data, message) {
  res.json({data, status: "success", message});
}

function response400(res, err, msg) {
  const error = typeof err === "string" ? {message: err} : (err || {});
  if (msg && error.message) {
    error.message = `${msg} :: ${error.message}`;
  } else if (msg) {
    error.message = msg;
  }

  console.error(error);
  res.status(400).json({status: "error", message: error.message});
}

function response404(res, message) {
  res.status(404).json({status: "error", message});
}

module.exports = (mongoose) => {

  const Task = mongoose.model("Task");

  function list(req, res) {
    Task.find({})
      .then((tasks) => {
        response200(res, {tasks}, `Found '${tasks.length}' tasks.`);
      })
      .catch((err) => {
        response400(res, err, "Tasks couldn't be found!");
      });
  }

  function create(req, res) {
    Task.create(req.body)
      .then((task) => {
        response200(res, {task}, `Task '${task.name}' successfully created.`);
      })
      .catch((err) => {
        response400(res, err, "Task couldn't be created!");
      });
  }

  function read(req, res) {
    Task.findById({_id: req.params.taskId})
      .then((task) => {
        if (task) {
          response200(res, {task}, `Task '${task.name}' found.`);
        } else {
          response404(res, "Task not found!");
        }
      })
      .catch((err) => {
        response400(res, err, "Task couldn't be found!");
      });
  }

  function update(req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true})
      .then((task) => {
        if (task) {
          response200(res, {task}, `Task '${task.name}' successfully updated.`);
        } else {
          response404(res, "Task not found!");
        }
      })
      .catch((err) => {
        response400(res, err, "Task couldn't be updated!");
      });
  }

  function remove(req, res) {
    Task.deleteOne({_id: req.params.taskId})
      .then((rs) => {
        if (rs && rs.ok === 1 && rs.n === 1) {
          response200(res, {rs}, "Task successfully removed.");
        } else {
          response404(res, "Task not found!");
        }
      })
      .catch((err) => {
        response400(res, err, "Task couldn't be removed!");
      });
  }
  
  return {
    list,
    create,
    read,
    update,
    remove
  };
  
};