import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../models/User.js";
import faker from "faker";
import Post from "../models/Post.js";

import {generateUserData, createUsers} from "./helpers/authHelpers.js";
import {generatePost, createPost} from "./helpers/postHelpers.js";

chai.use(chaiHttp);

describe("PostLike Test", function() {
  let user, post, userToken;
  
  before("Create User data", async function() {
    user = generateUserData(1)[0];
    try { 
      return await createUsers(user, app, "/api/users/register");
    }
    catch(error) {
      console.error(error);
      return false;
    }
  });
  before("Login User", function(done) {
    chai.request(app)
      .post("/api/users/login")
      .send({email: firstUser.email, password: user.password})
      .end((error, response) => {
        if (error) {
          console.error(eror);
          done(error);
        }
        userToken = response.body.token;
        done();
      })
  });
  after("Clean Up", async function() {
    try {
      let _ = await User.deleteMany({});
      process.exit(0);
    }
    catch(error) {
      console.error(error)
      process.exit(1);
    }
  })
  describe("someto", function() {
    it("passed", function (done) {
      console.log(user);
      console.log(userToken)
      done();
    })
  })
  /*
  describe("A guest User", function() {
    beforeEach("Find a Post", async function() {
      firstPost = await Post.findOne()
    })
    describe("POST /api/postLikes", function() {
      it("Should not be able to like a Post", function(done) {
      });
      it("Should not increment Post.like count", function(done) {

      });
    });
    describe("DELETE, /api/postLikes", function() {
      it("Should Delete a PostLike", function(done) {

      })
      it("Should decrement Post.like count", function(done) {

      })
    })
  });
  it("Should not be able to unlike a Post", function(done) {

  })
  //end guest user
  describe("A logged in User", function() {
  })
  */
});
