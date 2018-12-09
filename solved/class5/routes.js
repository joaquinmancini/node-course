module.exports = (app, router) => {

  const mongoose = app.get("mongoose"),
    config = app.get("config"),
    taskControllers = require("./controllers/tasks")(mongoose),
    tokenControllers = require("./controllers/token")(mongoose, config);
  
  router.route("/tasks")
    .get(taskControllers.list)
    .post(taskControllers.create);

  router.route("/tasks/:taskId")
    .get(taskControllers.read)
    .put(taskControllers.update)
    .delete(taskControllers.remove);
  
  router.route("/token")
    .get(tokenControllers.generate)
    .post(tokenControllers.read);
  
  return router;
};