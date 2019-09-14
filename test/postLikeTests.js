import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import Post from "../models/Post.js";

import {createPost} from "./helpers/postHelpers.js";
import mongoose from "mongoose";
import seedDB from "./seeds/seedDB.js";
import PostLike from "../models/PostLike.js";

chai.use(chaiHttp);

describe("PostLike Tests", function() {
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
    mongoose.connection.db.dropDatabase()
      .then((response) => {
        mongoose.connection.close()
          .then(() => {
            done();
          })
      })
  });
  
  describe("A guest User", function() {
    let testPost;
    beforeEach("Create a Post", async function() {
      testPost = await createPost(user);
    });
    afterEach("Delete the Post", async function() {
      return await Post.findOneAndDelete({id: testPost._id});
    });
    describe("POST /api/posts/like_post", function() {
      it("Should NOT be able to like a Post", function(done) {
        chai.request(app)
          .post("/api/posts/like_post/" + testPost._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT increment Post.like count", function(done) {
        chai.request(app)
          .post("/api/posts/like_post/" + testPost._id)
          .end((error, response) => {
            Post.findOne({_id: testPost._id})
              .then((post) => {
                expect(response).to.have.status(401);
                expect(post.likeCount).to.equal(testPost.likeCount);
                done();
              });
          });
      });
    });
    describe("DELETE, /api/posts/unlike_post", function() {
      it("Should NOT DELETE a PostLike", function(done) {
        chai.request(app)
          .delete("/api/posts/unlike_post/" + testPost._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT decrement Post.like count", function(done) {
        chai.request(app)
          .delete("/api/posts/unlike_post/" + testPost._id)
          .end((error, response) => {
            Post.findOne({_id: testPost._id})
              .then((post) => {
                expect(response).to.have.status(401);
                expect(post.likeCount).to.equal(testPost.likeCount);
                done();
              })
          });
      });
    });
  });
  // end guest user //
  describe("A logged in User", function() {
    let post, likeCount, PostLikes;
    before("Create two Posts. Like one Post", function(done) {
      createPost(user)
        .then((createdPost) => {
          post = createdPost;
          likeCount = createdPost.likeCount;
          return createPost(user);
        })
        .then((anotherPost) => {
          return PostLike.create({userId: user._id, postId: anotherPost._id})
        })
        .then((postLike) => {
          done();
        })
        .catch((error) => {
          console.error(error)
          done();
        })
    })
    before("Count PostLike model", function(done) {
      PostLike.countDocuments({}, (err, result) => {
        PostLikes = result;
        done();
      })
    })
    after("Delete a Post and PostLikes", function(done) {
      Post.findOneAndDelete({_id: post._id})
        .then((deletedPost) => {
          return PostLike.deleteOne({postId: post._id, userId: user._id});
        })
        .then((response) => {
          done();
        })
        .catch((err) => {
          console.error(err);
          done();
        })
    })
    describe("POST /api/posts/like_post/:postId", function() {
      it("Should be able to Like a Post", function(done) {
        chai.request(app)
          .post("/api/posts/like_post/" + post._id)
          .set({"Authorization": userToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.post).to.not.be.null;
            done();
          });
      });
      it("Should increment number of Post.likeCount by 1", function(done) {
        Post.findOne({_id: post._id})
          .then((post) => {
            expect(post.likeCount).to.equal(likeCount + 1);
            done();
          })
          .catch((error) => {
            console.error(error);
            done();
          })
      });
      it("Should add a PostLike", function(done) {
        PostLike.countDocuments({}, (err, newCount) => {
          expect(newCount).to.equal(PostLikes + 1);
          done();
        })
      })
      it("Should NOT be able to like the same Post", function(done) {
        chai.request(app)
          .post("/api/posts/like_post/" + post._id)
          .set({"Authorization": userToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(400);
            done();
          });
      });
      it("Should NOT increment number of Post.likeCount", function(done) {
        Post.findOne({_id: post._id})
          .then((post) => {
            expect(post.likeCount).to.equal(1);
            done();
          })
          .catch((error) => {
            console.error(error);
            done();
          });
      });
    });
  });
  // end logged in user //
});
