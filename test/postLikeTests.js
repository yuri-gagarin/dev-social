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
      let res = await createUsers(user, app, "/api/users/register");
    }
    catch(error) {
      console.error(error);
      return false;
    }
  });
  before("Login User", function(done) {
    chai.request(app)
      .post("/api/users/login")
      .send({email: user.email, password: user.password})
      .end((error, response) => {
        if (error) {
          console.error(error);
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
  describe("A guest User", function() {
    beforeEach("Create a Post", async function() {
      post = await createPost(user);
    });
    afterEach("Delete the Post", async function() {
      return await Post.deleteMany({});
    });
    describe("POST /api/postLikes", function() {
      it("Should not be able to like a Post", function(done) {
        chai.request(app)
          .post("/api/postLikes")
          .send({postId: post._id})
          .end((error, response) => {
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should not increment Post.like count", function(done) {
        const postLikeCount = post.likes;
        chai.request(app)
          .post("/api/postLikes")
          .send({postId: post._id})
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.body.postLikes).to.equal(postLikeCount);
          })
      });
    });
    describe("DELETE, /api/postLikes", function() {
      it("Should not DELETE a PostLike", function(done) {
        chai.request(app)
          .delete("/api/postLikes")
          .send({postId: post._id})
          .end((error, response) => {
            expect(response).to.have.status(401);
            end();
          });
      });
      it("Should not decrement Post.like count", function(done) {
        chai.request(app)
          .delete("/api/postLikes")
          .send({postId: post._id})
          .end((error, response) => {
            expect(response).to.have.status(401);
            end();
          });
      });
    });
  });
});
