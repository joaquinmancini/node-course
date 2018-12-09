const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  // Token = mongoose.model("Token"),
  path = "/api/token";

describe.skip("Token controller tests", () => {

  let createdTokens = null;

  beforeEach(() => {
    return Token.deleteMany({})
      .then(() => {
        console.log("Tokens collection cleaned!");
        return Promise.all([
          Token.create({}),
          Token.create({}),
          Token.create({})
        ]);
      })
      .then((data) => {
        createdTokens = data;
      });
  });

  context("#GET /token", () => {

    it("should return a new token", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          // @TODO Complete me!
        });
    });

  });

  context("#POST /token", () => {

    it("should return the expiration date for a given token", () => {
      // @TODO Complete me!
    });

    it("should return null because the token doesn't exist", () => {
      // @TODO Complete me!
    });

    it("should return null because the token is expired", () => {
      // @TODO Complete me!
    });

  });

});
