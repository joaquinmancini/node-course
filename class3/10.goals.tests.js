const goalsModule = require("./10.goals"), 
  expect = require("chai").expect;

describe("tests for goals", () => {

  it("should return the Messi's goals", () => {
    const goals = goalsModule.getGoalsFrom("Messi");
    expect(goals).to.have.length(2);
    expect(goals[0]).to.have.property("score");
    expect(goals[0].against).to.be.eql("Real Madrid");
    expect(goals[1].against).to.be.eql("Estudiantes");
  });

  it("should return the Tevez's goals", () => {
    const goals = goalsModule.getGoalsFrom("Tevez");
    expect(goals).to.have.length(1);
    expect(goals[0].against).to.be.eql("River");
  });

  context("now testing async", () => {

    it("should return error and no goals if there is an error", (done) => {
      const myError = new Error("an error");
      goalsModule.asyncTaskAndGetGoals(myError, (err, goals) => {
        expect(err).to.be.eql(myError);
        expect(goals).to.be.eql(null);
        done();
      });
    });

    it("should return all the goals if no errors", (done) => {
      const error = null;
      goalsModule.asyncTaskAndGetGoals(error, (err, goals) => {
        expect(err).to.be.eql(error);
        expect(goals).to.be.eql(goalsModule.goals);
        done();
      });
    });

    it("should return a Promise with all the goals", () => {
      return goalsModule.asyncPromiseAndGetGoals().then((result) => {
        expect(result).to.be.eql(goalsModule.goals);
      });
    });

    it("should return a rejected Promise with an error", () => {
      return goalsModule.asyncPromiseReject()
        .then(() => Promise.reject("Should fail!"))
        .catch((err) => {
          expect("This is an error!").to.be.eql(err);
        });
    });
  });
});