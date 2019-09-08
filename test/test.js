import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import mongoose, { mongo } from "mongoose";
import User from "../models/User.js";
import KEYS from "../config/keys.js";
//configure
chai.use(chaiHttp);
chai.should();


//connect to test db
describe("User Registration", () => {
  const validUser = {
    name: "User",
    lastName: "User",
    email: "user@user.com",
    password: "Password1",
    passwordConfirm: "Password1",
  };

  before("connect to the database", async() => {
    const DB = KEYS.mongoURI;
    try {
      const database = await mongoose.connect(DB, {useNewUrlParser: true, useFindAndModify: false});
      const response  = await User.deleteMany({});
    }
    catch(error) {
      console.error(error);
    }
  });

  describe("POST /api/register", () => {
    it("Should register a user", (done) => {
      chai.request(app)
        .post("/api/users/register")
        .send(validUser)
        .end((error, response) => {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
        });
        done();
    });

    it("Should not register an invalid user", (done) => {
      const invalidUser = {name: null, firstName: null,  email: null, password: null};
      chai.request(app)
        .post("/api/users/register")
        .send(invalidUser)
        .end((error, response) => {
          expect(response).to.have.status(400);
        });
        done();
    });

    it("Should not register a user without a name", (done) => {
      const invalidUser = {...validUser, name: null};
      chai.request(app)
        .post("/api/users/register")
        .send(invalidUser)
        .end((error, response) => {
          const responseText = JSON.parse(response.text);
          expect(response).to.have.status(400);
          expect(responseText.errors).to.not.be.null;
          expect(responseText.errors.name).to.not.be.null;
        });
        done();
    });

    it("Should not register a user without a last name", (done) => {
      const invalidUser = {...validUser, lastName: null};
      chai.request(app)
        .post("/api/user/register")
        .send(invalidUser)
        .end((error, response)  => {
          const responseText = JSON.parse(response.text);
          expect(response).to.have.status(400);
          expect(responseText.errors).to.not.be.null;
          expect(responseText.errors.name).to.not.be.null;
        });
        done();
    });

    it("Should not register a user without email", (done) => {
      const invalidUser = {...validUser, email: null};
      chai.request(app)
        .post("/api/users/register")
        .send(invalidUser)
        .end((error, response) => {
          const responseText = JSON.parse(response.text);
          expect(response).to.have.status(400);
          expect(responseText.errors).to.not.be.null;
          expect(responseText.errors.email).to.not.be.null;
        });
        done();
    });

    it("Should not register a user mismatching passwords", (done) => {
      const invalidUser = {...validUser, passwordConfirm: "NotThePassword"};
      chai.request(app)
        .post("/api/users/register")
        .send(invalidUser)
        .end((error, response) => {
          const responseText = JSON.parse(response.text);
          expect(response).to.have.status(400);
          expect(responseText.errors).to.not.be.null;
          expect(responseText.errors.password).to.not.be.null;
        });
        done();
    });

    it("Should not register a user with invalid password", (done) => {
      const invalidUser = {...validUser, password: null, passwordConfirm: null};
      chai.request(app)
        .post("/api/users/register")
        .send(invalidUser)
        .end((error, response) => {
          const responseText = JSON.parse(response.text);
          expect(response).to.have.status(400);
          expect(responseText.errors).to.not.be.null;
          expect(responseText.errors.password).to.not.be.null;
        });
        done();
    });

  });
});



