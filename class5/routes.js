module.exports = (app, router) => {

  const mongoose = app.get("mongoose"),
    taskControllers = require("./controllers/tasks")(mongoose);
  
  router.route("/tasks")
    .get(taskControllers.list)
    .post(taskControllers.create);

  router.route("/tasks/:taskId")
    .get(taskControllers.read)
    .put(taskControllers.update)
    .delete(taskControllers.remove);
  
  return router;
};