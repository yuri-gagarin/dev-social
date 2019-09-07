import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

//configure
chai.use(chaiHttp);
chai.should();

describe("Authorization", () => {
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
        })
    })
  })
});

console.log("passing");


