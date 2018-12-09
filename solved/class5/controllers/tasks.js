module.exports = (mongoose) => {

  const Task = mongoose.model("Task"),
    filterFields = ["name", "status"],
    sortFields = ["name", "status"];

  function buildFilterQuery(params) {
    return filterFields.reduce((query, prop) => {
      if (params[prop]) {
        query[prop] = params[prop];
      }
      return query;
    }, {});
  }

  function buildSortQuery(sortBy = "") {
    const [sortField, sortDir] = sortBy.split(",");

    if (sortFields.indexOf(sortField) > -1) {
      return {[sortField]: sortDir.toLowerCase() === "desc" ? -1 : 1};
    }
    return {};
  }

  function list(req, res) {
    Task.find(buildFilterQuery(req.query)).sort(buildSortQuery(req.query.sort))
      .then((tasks) => {
        res.response200({tasks}, `Found '${tasks.length}' tasks.`);
      })
      .catch((err) => {
        res.response500(err, "Tasks couldn't be found!");
      });
  }

  function create(req, res) {
    Task.create(req.body)
      .then((task) => {
        res.response200({task}, `Task '${task.name}' successfully created.`);
      })
      .catch((err) => {
        res.response500(err, "Task couldn't be created!");
      });
  }

  function read(req, res) {
    Task.findById({_id: req.params.taskId})
      .then((task) => {
        if (task) {
          res.response200({task}, `Task '${task.name}' found.`);
        } else {
          res.response404("Task not found!");
        }
      })
      .catch((err) => {
        res.response500(err, "Task couldn't be found!");
      });
  }

  function update(req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true, runValidators: true})
      .then((task) => {
        if (task) {
          res.response200({task}, `Task '${task.name}' successfully updated.`);
        } else {
          res.response404("Task not found!");
        }
      })
      .catch((err) => {
        res.response500(err, "Task couldn't be updated!");
      });
  }

  function remove(req, res) {
    Task.deleteOne({_id: req.params.taskId})
      .then((rs) => {
        if (rs && rs.ok === 1 && rs.n === 1) {
          res.response200({rs}, "Task successfully removed.");
        } else {
          res.response404("Task not found!");
        }
      })
      .catch((err) => {
        res.response500(err, "Task couldn't be removed!");
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