import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import Post from "../models/Post.js";

import {createPost} from "./helpers/postHelpers.js";
import seedDB from "./seeds/seedDB.js";
import PostDislike from "../models/PostDislike.js";

chai.use(chaiHttp);

describe("PostDislikeLike Tests", function() {
  let user, userToken;
  before("Populate DB", function(done) {
    this.timeout(10000);
    seedDB({numberOfUsers: 5, numberOfPostsPerUser: 3, maxCommentsPerPost: 3})
      .then((result) => {
        user = result.users.firstUser;
        done();
      })
      .catch((error) => {
        console.error(error);
      })
  });;
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
  describe("A guest User", function() {
    let post, dislikeCount, PostDislikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((postResponse) => {
          post = postResponse;
          dislikeCount = post.dislikeCount;
          PostDislike.countDocuments({}, (err, count) => {
            if (err) return Promise.reject(err);
            PostDislikes = count;
            done();
          });
        })
        .catch((error) => {
          console.error(error);
          done(error);
        });
    });
    
    describe("POST /api/posts/dislike_post", function() {
      it("Should NOT be able to dislike a Post", function(done) {
        chai.request(app)
          .post("/api/posts/dislike_post/" + post._id)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT increment Post.dislikeCount", function(done) {
        Post.findOne({_id: post._id})
          .then((post) => {
            expect(post.dislikeCount).to.equal(dislikeCount);
            done();
          })
      });
      it("Should NOT add a PostLike", function(done) {
        PostDislike.countDocuments({}, (err, count) => {
          expect(count).to.equal(PostDislikes);
          done();
        });
      });
    });
    describe("DELETE, /api/posts/undislike_post", function() {
      it("Should NOT be able to unlike a Post", function(done) {
        chai.request(app)
          .delete(("/api/posts/undislike_post" + post._id))
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      })
      it("Should NOT decrement Post.likeCount", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.likeCount).to.equal(likeCount);
              done();
            })
            .catch((error) => {
              console.error(error)
              done();
            })
          });
      });
      it("Should NOT remove a PostLike", function(done) {
          PostLike.countDocuments({}, (err, count) => {
            if(err) {console.error(err)};
            expect(count).to.equal(PostLikes);
            done();
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
      });
    });
    describe("POST /api/posts/dislike_post/:postId", function() {
      describe("User liking an unliked Post ", function() {
        it("Should be able to Like a Post", function(done) {
          chai.request(app)
            .post("/api/posts/dislike_post/" + post._id)
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
            .post("/api/posts/dislike_post/" + post._id)
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
    describe("DELETE /api/posts/undislike_post/:postId", function() {
      describe("User unliking a post they liked", function() {
        it("Should be able to unlike a post", function(done) {
          chai.request(app)
            .delete("/api/posts/undislike_post/" + post._id)
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
            .delete("/api/posts/undislike_post/" + post._id)
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
