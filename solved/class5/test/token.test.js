const app = require("../app.js"),
  expect = require("chai").expect,
  request = require("supertest"),
  mongoose = app.get("mongoose"),
  Token = mongoose.model("Token"),
  path = "/api/token";

describe("Token controller tests", () => {

  let createdToken = null;

  beforeEach(() => {
    return Token.deleteMany({})
      .then(() => {
        console.log("Tokens collection cleaned!");
        return Token.create({token: "123", expireDate: new Date(new Date().getTime() + 60000)});
      })
      .then((token) => {
        createdToken = token;
      });
  });

  context("#GET /token", () => {

    it("should return a new token", () => {
      return request(app)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.data.token.length).to.gt(0);
        });
    });

  });

  context("#POST /token", () => {

    it("should return the expiration date for a given token", () => {
      return request(app)
        .post(path)
        .set("token", createdToken.token)
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(new Date(res.body.data).toUTCString()).to.eql(createdToken.expireDate.toUTCString());
        });
    });

    it("should return null because the token doesn't exist", () => {
      return request(app)
        .post(path)
        .set("token", "does-not-exist")
        .expect(200)
        .then((res) => {
          expect(res.body.status).to.eql("success");
          expect(res.body.message).to.eql("Token expired or not found!");
          expect(res.body.data).to.eql(null);
        });
    });

    it("should return null because the token is expired", () => {
      return Token.create({token: "abc", expireDate: new Date().setMinutes(-1)})
        .then((token) => {
          return request(app)
            .post(path)
            .set("token", token.token)
            .expect(200)
            .then((res) => {
              expect(res.body.status).to.eql("success");
              expect(res.body.message).to.eql("Token expired or not found!");
              expect(res.body.data).to.eql(null);
            });
        });
    });

  });

});
