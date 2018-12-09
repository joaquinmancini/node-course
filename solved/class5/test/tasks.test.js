const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Task = mongoose.model("Task"),
  taskId = new mongoose.Types.ObjectId(),
  path = "/api/tasks";

describe("Tasks controller tests", () => {

  let createdTasks = null,
    task1 = null;

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

    it("should get all tasks", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.tasks).to.be.an("array");
          expect(res.body.data.tasks.length).to.eql(3);
        });
    });

    describe.skip("filter", () => {

      it("should filter tasks by name", () => {
        return request(app)
          .get(`${path}?name=${task1.name}`)
          .expect(200)
          .then((res) => {
            expect(res.body.status).to.eql("success");
            expect(res.body.data.tasks).to.be.an("array");
            expect(res.body.data.tasks.length).to.eql(1);
            expect(res.body.data.tasks[0]._id.toString()).to.eql(task1._id.toString());
          });
      });
  
      it("should filter tasks by status", () => {
        // @TODO Complete me!
      });

    });

    describe.skip("sort", () => {

      it("should sort tasks by name,desc", () => {
        return request(app)
          .get(`${path}?sort=name,desc`)
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
        // @TODO Complete me!
      });

    });

  });

  context("#POST /tasks", () => {

    it("should create a task", () => {
      const body = {
        name: "Task POST test",
        status: "doing"
      };
      
      return request(app)
        .post(path)
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
        .send({name: "Failed task", status: "whatever"})
        .expect(500)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contains("is not a valid enum value");
        });
    });

  });

  context("#GET /tasks/:taskId", () => {

    it("should get a task", () => {
      return request(app)
        .get(`${path}/${task1.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.task._id.toString()).to.eql(task1._id.toString());
        });
    });

    it("should fail because task wasn't found", () => {
      return request(app)
        .get(`${path}/${taskId}`)
        .expect(404)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task not found!");
        });
    });

  });

  context("#PUT /tasks/:taskId", () => {

    it("should update a task", () => {
      const body = {
        name: "Updated task"
      };

      return request(app)
        .put(`${path}/${task1.id}`)
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
        .expect(404)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task not found!");
        });
    });

    it("should fail because status isn't right", () => {
      return request(app)
        .put(`${path}/${task1.id}`)
        .send({name: "Failed task", status: "whatever"})
        .expect(500)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contains("is not a valid enum value");
        });
    });

  });

  context("#DELETE /tasks/:taskId", () => {

    it("should delete a task", () => {
      return request(app)
        .delete(`${path}/${task1.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.message).to.contain("Task successfully removed.");
        });
    });

    it("should fail because task wasn't found", () => {
      return request(app)
        .delete(`${path}/${taskId}`)
        .expect(404)
        .then((res) => {
          expect(res.body.status).to.eql("error");
          expect(res.body.message).to.contain("Task not found!");
        });
    });

  });

});
