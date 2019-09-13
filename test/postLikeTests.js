import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../models/User.js";
import faker from "faker";
import Post from "../models/Post.js";

import {generateUserData, createUsers} from "./helpers/authHelpers.js";
import {generatePost, createPost} from "./helpers/postHelpers.js";
import mongoose from "mongoose";
import seedDB from "./seeds/seedDB.js";
import { test } from "mocha";

chai.use(chaiHttp);

describe("PostLike Test", function() {
  let user, bData, userToken, dbData;
  before("Populate DB", async function() {
    try {
      dbData = await seedDB();
      const testDatabase = dbData;
    }
    catch (error) {
      console.error(error);
    }
  });
  before("Login User", function(done) {
    user = dbData.users.firstUser;
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
  after("Clean Up", function(done) {
    mongoose.connection.db.dropDatabase
      .then((response) => {
        mongoose.connection.close()
          .then(() => {
            done(process.exit);
          })
      })
  })
  describe("A guest User", function() {
    describe("POST /api/posts/like_post", function() {
      let testPost;
      beforeEach("Create a Post", async function() {
        console.log("Creating Post")
        testPost = await createPost(user);
      });
      afterEach("Delete the Post", async function() {
        console.log("Deleting Post")
        return await Post.findOneAndDelete({id: testPost._id});
      });
      it("Should not be able to like a Post", function(done) {
        chai.request(app)
          .post("/api/posts/like_post/" + testPost._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should not increment Post.like count", function(done) {
        const postLikeCount = testPost.likes;
        chai.request(app)
          .post("/api/posts/like_post/" + testPost._id)
          .end((error, response) => {
            console.log("Still running second test")
            Post.findOne({id: testPost._id})
              .then((post) => {
                expect(response).to.have.status(401);
                expect(post.likes).to.equal(testPost.likes);
                done();
              });
          });
      });
    });
    describe("DELETE, /api/posts/unlike_post", function() {
      it("Should not DELETE a PostLike", function(done) {
        chai.request(app)
          .delete("/api/posts/unlike_post/" + post._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            end();
          });
      });
      it("Should not decrement Post.like count", function(done) {
        chai.request(app)
          .delete("/api/posts/unlike_post/" + post._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            end();
          });
      });
    });
  });
});
