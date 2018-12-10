const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Task = mongoose.model("Task"),
  Token = mongoose.model("Token"),
  taskId = new mongoose.Types.ObjectId(),
  path = "/api/tasks",
  testToken = "test-token";

describe("Tasks controller tests", () => {

  let createdTasks = null,
    task1 = null;

  before(() => {
    return Token.deleteMany({})
      .then(() => {
        return Token.create({token: testToken, expireDate: new Date(new Date().getTime() + 60000)});
      });
  });

  beforeEach(() => {
    return Task.deleteMany({})
      .then(() => {
        console.log("Tasks collection cleaned!");
        return Promise.all([
          Task.create({name: "Task 1", status: "pending", createdDate: new Date().setDate(1)}),
          Task.create({name: "Task 2", status: "doing", createdDate: new Date().setDate(2)}),
          Task.create({name: "Task 3", status: "completed", createdDate: new Date().setDate(3)})
        ]);
      })
      .then((data) => {
        createdTasks = data;
        task1 = data[0];
      });
  });

  context("#GET /tasks", () => {

    it("should respond 401 if token is not valid", () => {
      return request(app)
        .get(path)
        .set("token", "not-valid-token")
        .expect(401);
    });

    it("should get all tasks", () => {
      return request(app)
        .get(path)
        .set("token", testToken)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.tasks).to.be.an("array");
          expect(res.body.data.tasks.length).to.eql(3);
        });
    });

    describe("filter", () => {

      it("should filter tasks by name", () => {
        return request(app)
          .get(`${path}?name=${task1.name}`)
          .set("token", testToken)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.tasks).to.be.an("array");
            expect(res.body.data.tasks.length).to.eql(1);
            expect(res.body.data.tasks[0]._id.toString()).to.eql(task1._id.toString());
          });
      });
  
      it("should filter tasks by status", () => {
        return request(app)
          .get(`${path}?status=${task1.status}`)
          .set("token", testToken)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.tasks).to.be.an("array");
            expect(res.body.data.tasks.length).to.eql(1);
            expect(res.body.data.tasks[0]._id.toString()).to.eql(task1._id.toString());
          });
      });

    });

    describe("sort", () => {

      it("should sort tasks by name,desc", () => {
        return request(app)
          .get(`${path}?sort=name,desc`)
          .set("token", testToken)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.tasks).to.be.an("array");
            expect(res.body.data.tasks.length).to.eql(3);
            expect(res.body.data.tasks[0]._id.toString()).to.eql(createdTasks[2]._id.toString());
            expect(res.body.data.tasks[1]._id.toString()).to.eql(createdTasks[1]._id.toString());
            expect(res.body.data.tasks[2]._id.toString()).to.eql(createdTasks[0]._id.toString());
          });
      });
  
      it("should sort tasks by status,asc", () => {
        return request(app)
          .get(`${path}?sort=status,asc`)
          .set("token", testToken)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.tasks).to.be.an("array");
            expect(res.body.data.tasks.length).to.eql(3);
            expect(res.body.data.tasks[0]._id.toString()).to.eql(createdTasks[2]._id.toString());
            expect(res.body.data.tasks[1]._id.toString()).to.eql(createdTasks[1]._id.toString());
            expect(res.body.data.tasks[2]._id.toString()).to.eql(createdTasks[0]._id.toString());
          });
      });

    });

  });

  context("#POST /tasks", () => {

    it("should respond 401 if token is not valid", () => {
      return request(app)
        .post(path)
        .set("token", "not-valid-token")
        .expect(401);
    });

    it("should create a task", () => {
      const body = {
        name: "Task POST test",
        status: "doing"
      };
      
      return request(app)
        .post(path)
        .set("token", testToken)
        .send(body)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.task.name).to.eql(body.name);
          expect(res.body.data.task.status).to.eql(body.status);
        });
    });

    it("should fail because name wasn't given", () => {
      return request(app)
        .post(path)
        .set("token", testToken)
        .send({})
        .expect(500)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task name is mandatory");
        });
    });

    it("should fail because status isn't right", () => {
      return request(app)
        .post(path)
        .set("token", testToken)
        .send({name: "Failed task", status: "whatever"})
        .expect(500)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contains("is not a valid enum value");
        });
    });

  });

  context("#GET /tasks/:taskId", () => {

    it("should respond 401 if token is not valid", () => {
      return request(app)
        .get(`${path}/${task1.id}`)
        .set("token", "not-valid-token")
        .expect(401);
    });

    it("should get a task", () => {
      return request(app)
        .get(`${path}/${task1.id}`)
        .set("token", testToken)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.task._id.toString()).to.eql(task1._id.toString());
        });
    });

    it("should fail because task wasn't found", () => {
      return request(app)
        .get(`${path}/${taskId}`)
        .set("token", testToken)
        .expect(404)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task not found!");
        });
    });

  });

  context("#PUT /tasks/:taskId", () => {

    it("should respond 401 if token is not valid", () => {
      return request(app)
        .put(`${path}/${task1.id}`)
        .set("token", "not-valid-token")
        .expect(401);
    });

    it("should update a task", () => {
      const body = {
        name: "Updated task"
      };

      return request(app)
        .put(`${path}/${task1.id}`)
        .set("token", testToken)
        .send(body)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.task.name).to.eql(body.name);
        });
    });

    it("should fail because task wasn't found", () => {
      return request(app)
        .put(`${path}/${taskId}`)
        .set("token", testToken)
        .expect(404)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task not found!");
        });
    });

    it("should fail because status isn't right", () => {
      return request(app)
        .put(`${path}/${task1.id}`)
        .set("token", testToken)
        .send({name: "Failed task", status: "whatever"})
        .expect(500)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contains("is not a valid enum value");
        });
    });

  });

  context("#DELETE /tasks/:taskId", () => {

    it("should respond 401 if token is not valid", () => {
      return request(app)
        .delete(`${path}/${task1.id}`)
        .set("token", "not-valid-token")
        .expect(401);
    });

    it("should delete a task", () => {
      return request(app)
        .delete(`${path}/${task1.id}`)
        .set("token", testToken)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.message).to.contain("Task successfully removed.");
        });
    });

    it("should fail because task wasn't found", () => {
      return request(app)
        .delete(`${path}/${taskId}`)
        .set("token", testToken)
        .expect(404)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task not found!");
        });
    });

  });

});
