import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../models/User.js";

//configure
chai.use(chaiHttp);
chai.should();

describe("Authorization", () => {
  const validUser = {
    name: "Test",
    lastName: "User",
    email: "test@test.com",
    password: "Password1",
    passwordConfirm: "Password1",
  };
  before("clear user if registered", () => {
    try {
      chai.request(app)
        .delete("/api/users/:id")
        .send(validUser)
    }
    catch (error) {
      cosnsole.log(error);
    }
  })
  describe("POST /api/register", () => {
    it("should Register a user", (done) => {
      chai.request(app)
        .post("/api/users/register")
        .send(validUser)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
        })
    });
  });

  describe("POST /api/login", () => {
    it("should Login a user", (done) => {

      const user = { 
        email: "user@user.com",
        password: "Password1",
      };

      chai.request(app)
        .post("/api/users/login")
        .send(user)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          done();
        });
    });
    it("should not login a user with an incorrect password", (done) => {

      const user = {
        email: "user@user.com",
        password: "wrongpassword",
      };

      chai.request(app)
        .post("/api/users/login")
        .send(user)
        .end((error, response) => {
          expect(response).to.have.status(400);
          //console.log(response.error.text);
          const errorResponse = JSON.parse(response.error.text);
          expect(errorResponse).to.be.an("object");
          expect(errorResponse.message).to.not.be.null;
          done();
        });
    });
    it("should not login a user with an incorrect email", (done) => {
      const user = {
        email: "wrongemail@wrong.com",
      };

      done()
    })
  });
});



