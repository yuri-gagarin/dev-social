import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../models/User.js";
//configure
chai.use(chaiHttp);
chai.should();

describe("Authorization Tests", function() {

  after("Exit the function", function() {
    User.deleteMany({}, (err) => {
      if(err) {
        console.error(err)
        process.exit(1);
      }
      process.exit(0);
    });
  });

  describe("User Registration", function() {
    const validUser = {
      name: "User",
      lastName: "User",
      email: "user@user.com",
      password: "Password1",
      passwordConfirm: "Password1",
    };

    before("Clear any User data", function(done) {
      User.deleteMany({}, (err) => {
        if(err) {
          console.error("error");
        }
        done();
      });
    });
    describe("POST /api/register \n", function() {
      it("Should register a user", function(done) {
        chai.request(app)
          .post("/api/users/register")
          .send(validUser)
          .end((error, response) => {
            done();
          });
      });

      it("Should not register an invalid user", function(done) {
        const invalidUser = {name: null, firstName: null,  email: null, password: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            expect(response).to.have.status(400);
            done();
          });
      });
      it("Should not register a user without a name", function(done) {
        const invalidUser = {...validUser, name: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            const responseText = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(responseText.errors).to.not.be.null;
            expect(responseText.errors.name).to.not.be.null;
            done();
          });
      });

      it("Should not register a user without a last name", function(done) {
        const invalidUser = {...validUser, lastName: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response)  => {
            const responseText = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(responseText.errors).to.not.be.null;
            expect(responseText.errors.name).to.not.be.null;
            done();
          });
      });

      it("Should not register a user without email", function(done) {
        const invalidUser = {...validUser, email: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            const responseText = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(responseText.errors).to.not.be.null;
            expect(responseText.errors.email).to.not.be.null;
            done();
          });
      });

      it("Should not register a user mismatching passwords", function(done) {
        const invalidUser = {...validUser, passwordConfirm: "NotThePassword"};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            const responseText = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(responseText.errors).to.not.be.null;
            expect(responseText.errors.password).to.not.be.null;
            done();
          });
      });

      it("Should not register a user with invalid password", function(done) {
        const invalidUser = {...validUser, password: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            const responseText = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(responseText.errors).to.not.be.null;
            expect(responseText.errors.password).to.not.be.null;
            done();
          });
      });

      it("Should not register a duplicate user", function(done) {
        chai.request(app)
          .post("/api/users/register")
          .send(validUser)
          .end((error, response) => {
            const responseText = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(responseText.errors).to.not.be.null;
            expect(responseText.errors.message).to.not.be.null;
            done();
          });
      });
    });
  });


  describe("User Login", function() {
    const validUser = {
      name: "User",
      lastName: "User",
      email: "user@user.com",
      password: "Password1",
      passwordConfirm: "Password1",
    };
    before("Clear Database", function(done) {
      User.deleteMany({}, (err) => {
        if (err) {console.log(err)};
        done();
      });
    });
    before("Register a valid User", function(done) {
      chai.request(app)
        .post("/api/users/register")
        .send(validUser)
        .end((error, response) => {
          if(error) {console.log(error)};
          if(response.status == 200) {
            done();
          }
        });
    });
    describe("POST /api/login", function() {
      it("Should Login a user", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: validUser.email, password: validUser.password})
          .end((error, response) => {
            const userResponse = JSON.parse(response.text);
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(userResponse.token).to.not.be.null;
            expect(userResponse.user).to.not.be.null;
            done();
          });
      });
      it("Should not Login a user with blank form", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: null, password: null})
          .end((error, response) => {
            const userResponse = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(response.message).to.not.be.null;
            done();
          });
      });
      it("Should not Login a user with invalid email", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: "none@mail.com", password: "Password1"})
          .end((error, response) => {
            const userResponse = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(response.message).to.not.be.null;
            done();
          });
      });
      it("Should not Login a user with an invalid password", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: validUser.email, password: "Incorrect1"})
          .end((error, response) => {
            const userResponse = JSON.parse(response.text);
            expect(response).to.have.status(400);
            expect(response.message).to.not.be.null;
            done();
          });
      });
    });
  });
});


