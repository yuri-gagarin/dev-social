import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import mongoose from "mongoose";
import faker from "faker";
import keys from "../config/keys.js";
import User from "../models/User.js";
import {TEST_PASSWORD} from "./seeds/constants.js";
//configure
chai.use(chaiHttp);
chai.should();
const mongoURI = keys.mongoURI;

describe("Auth Tests", function() {

  const validUser = {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: TEST_PASSWORD,
    passwordConfirm: TEST_PASSWORD,
  };
  before("Connect to Database", function(done) {
    mongoose.connect(mongoURI, {useNewUrlParser: true})
      .then(() =>  done())
      .catch((error) => console.error(error));
  })
  before("Clear Databse", function(done) {
    mongoose.connection.db.dropDatabase()
      .then(() => done())
      .catch((error) => console.error(error));
  });
  after("Clean Up", function(done) {
    mongoose.connection.db.dropDatabase()
      .then(() => done())
      .catch((error) => console.error(error));
  });
  
  describe("User Registration", function() {
    
    describe("POST /api/register ", function() {
      it("Should register a user", function(done) {
        chai.request(app)
          .post("/api/users/register")
          .send(validUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            done();
          });
      });
      it("Should not register an invalid user", function(done) {
        const invalidUser = {name: null, firstName: null,  email: null, password: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            done();
          });
      });
      it("Should not register a user without a name", function(done) {
        const invalidUser = {...validUser, name: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.name).to.not.be.null;
            done();
          });
      });

      it("Should not register a user without a last name", function(done) {
        const invalidUser = {...validUser, lastName: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response)  => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.name).to.not.be.null;
            done();
          });
      });

      it("Should not register a user without email", function(done) {
        const invalidUser = {...validUser, email: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.email).to.not.be.null;
            done();
          });
      });

      it("Should not register a user mismatching passwords", function(done) {
        const invalidUser = {...validUser, passwordConfirm: "NotThePassword"};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.password).to.not.be.null;
            done();
          });
      });

      it("Should not register a user with invalid password", function(done) {
        const invalidUser = {...validUser, password: null};
        chai.request(app)
          .post("/api/users/register")
          .send(invalidUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.password).to.not.be.null;
            done();
          });
      });

      it("Should not register a duplicate user", function(done) {
        chai.request(app)
          .post("/api/users/register")
          .send(validUser)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.errors).to.not.be.null;
            expect(response.body.errors.message).to.not.be.null;
            done();
          });
      });
      it("should only have one User in Database", function(done) {
        User.countDocuments({}, (err, count) => {
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });
  // end User Registration //
  describe("User Login", function() {

    describe("POST /api/login", function() {
      it("Should Login a user", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: validUser.email, password: validUser.password})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.token).to.not.be.null;
            expect(response.body.user).to.not.be.null;
            done();
          });
      });
      it("Should not Login a user with blank form", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: null, password: null})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.meessage).to.not.be.null;
            done();
          });
      });
      it("Should not Login a user with invalid email", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: "none@mail.com", password: TEST_PASSWORD})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.message).to.not.be.null;
            done();
          });
      });
      it("Should not Login a user with an invalid password", function(done) {
        chai.request(app)
          .post("/api/users/login")
          .send({email: validUser.email, password: "Incorrect1"})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            expect(response.body.message).to.not.be.null;
            done();
          });
      });
    });
  });
  // end User Login //
});


