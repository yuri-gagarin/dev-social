import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import Post from "../models/Post.js";

import {createPost} from "./helpers/postHelpers.js";
import mongoose from "mongoose";
import seedDB from "./seeds/seedDB.js";
import PostLike from "../models/PostLike.js";
import postLikes from "../routes/postLikes.js";

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
  // Logged in User tests //
  describe("A logged in User", function() {
    let post, likeCount, PostLikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((createdPost) => {
          post = createdPost;
          likeCount = createdPost.likeCount;
          done();
        })
        .catch((error) => {
          console.error(error)
          done();
        })
    })
    before("Count PostLike model", function(done) {
      PostLike.countDocuments({}, (err, count) => {
        PostLikes = count;
        done();
      })
    })
    /*
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
    */
    describe("POST /api/posts/like_post/:postId", function() {
      describe("User liking an unliked Post ", function() {
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
              //set for delete test;
              likeCount = post.likeCount;
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
            PostLikes = newCount;
            done();
          })
        });
      });
      describe("User liking a Post they already liked", function() {
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
              expect(post.likeCount).to.equal(likeCount);
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            });
        });
        it("Should NOT add a PostLike", function(done) {
          PostLike.countDocuments({}, (error, count) => {
            expect(count).to.equal(PostLikes);
            done();
          });
        });
      });
    });
    describe("DELETE /api/posts/unlike_post/:postId", function() {
      describe("User unliking a post they liked", function() {
        it("Should be able to unlike a post", function(done) {
          chai.request(app)
            .delete("/api/posts/unlike_post/" + post._id)
              .set({"Authorization": userToken})
              .end((error, response) => {
                expect(error).to.be.null;
                expect(response.body.post).to.not.be.null;
                expect(response).to.have.status(200);
                done();
              })
        });
        it("Should decrement Post.likeCount by 1", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.likeCount).to.equal(likeCount - 1);
              likeCount = post.likeCount;
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            });
        });
        it("Should remove one PostLike", function(done) {
          PostLike.countDocuments({}, (error, count) => {
            expect(count).to.equal(PostLikes - 1);
            PostLikes = count;
            done();
          });
        });
      });
      describe("User unliking a post they did NOT like", function() {
        it("Should NOT be able to unlike a Post which user didn't like", function(done) {
          chai.request(app)
            .delete("/api/posts/unlike_post/" + post._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(response).to.have.status(400)
              done();
            });
        });
        it("Should NOT decrement Post.likeCount by 1", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.likeCount).to.equal(likeCount);
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            });
        });
        it("Should NOT remove a PostLike", function(done) {
          PostLike.countDocuments({}, (error, count) => {
            expect(count).to.equal(PostLikes);
            done();
          });
        });
      });
    });
  });
  // end logged in user tests //

});
