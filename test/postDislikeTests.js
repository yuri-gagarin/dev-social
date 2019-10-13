import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import Post from "../models/Post.js";

import {createPost} from "./helpers/postHelpers.js";
import seedDB from "./seeds/seedDB.js";
import PostLike from "../models/PostLike.js";
import PostDislike from "../models/PostDislike.js";
     
chai.use(chaiHttp);

describe("PostDislike Tests", function() {
  this.timeout(5000);
  let user, userToken;
  before("Populate DB", function(done) {
    this.timeout(10000);
    seedDB({
      numberOfUsers: 5, 
      numberOfPostsPerUser: 3, 
      maxCommentsPerPost: 0,
      withinADay: true,
      })
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
    
    describe("POST /api/posts/dislike_post/:postId", function() {
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
      it("Should NOT add a PostDislike", function(done) {
        PostDislike.countDocuments({}, (err, count) => {
          expect(count).to.equal(PostDislikes);
          done();
        });
      });
    });
    describe("DELETE, /api/posts/remove_dislike/:postId", function() {
      it("Should NOT be able to unlike a Post", function(done) {
        chai.request(app)
          .delete(("/api/posts/remove_dislike" + post._id))
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      })
      it("Should NOT decrement Post.dislikeCount", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(dislikeCount);
              done();
            })
            .catch((error) => {
              console.error(error)
              done();
            })
          });
      });
      it("Should NOT remove a PostDislike", function(done) {
          PostDislike.countDocuments({}, (err, count) => {
            if(err) {console.error(err)};
            expect(count).to.equal(PostDislikes);
            done();
          });
      });
  });
  // end guest user //
  // Logged in User tests //
  describe("A logged in User", function() {
    let post, likedPost, likeCount, dislikeCount, PostDislikes, PostLikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((createdPost) => {
          post = createdPost;
          dislikeCount = createdPost.dislikeCount;
          done();
        })
        .catch((error) => console.error(error));
  
    });
    before("Create a Post and add a PostLike", function(done) {
      createPost(user)
        .then((createdPost) => {
          likedPost = createdPost;
          return PostLike.create({postId: createdPost._id, userId: user._id})
        })
        .then((response) => {
          likedPost.likeCount +=1;
          return likedPost.save();
        })
        .then((post) => {done() })
        .catch((error) => console.error(error));
    })
    before("Count PostsDislike model", function(done) {
      PostDislike.countDocuments({}, (err, count) => {
        PostDislikes = count;
        done();
      });
    });
    describe("POST /api/posts/dislike_post/:postId", function() {
      describe("User disliking a new Post ", function() {
        it("Should be able to Dislike a Post", function(done) {
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
        it("Should increment number of Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(dislikeCount + 1);
              //set for delete test;
              dislikeCount = post.dislikeCount;
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            })
        });
        it("Should add a PostDislike", function(done) {
          PostDislike.countDocuments({}, (err, newCount) => {
            expect(newCount).to.equal(PostDislikes + 1);
            PostDislikes = newCount;
            done();
          })
        });
      });
      describe("User DISLIKING a Post they already DISLIKED", function() {
        it("Should NOT be able to dislike the same Post", function(done) {
          chai.request(app)
            .post("/api/posts/dislike_post/" + post._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(400);
              done();
            });
        });
        it("Should NOT increment number of Post.dislikeCount", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(dislikeCount);
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            });
        });
        it("Should NOT add a PostDislike", function(done) {
          PostDislike.countDocuments({}, (error, count) => {
            expect(count).to.equal(PostDislikes);
            done();
          });
        });
      });
    });
    describe("DELETE /api/posts/dislike_post/:postId", function() {
      describe("User removiving a dislike from a Post they disliked", function() {
        it("Should be able to remove a Dislike", function(done) {
          chai.request(app)
            .delete("/api/posts/remove_dislike/" + post._id)
              .set({"Authorization": userToken})
              .end((error, response) => {
                expect(error).to.be.null;
                //expect(response.error).to.be.null;
                expect(response.body.post).to.not.be.null;
                expect(response).to.have.status(200);
                done();
              })
        });
        it("Should decrement Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(dislikeCount - 1);
              dislikeCount = post.dislikeCount;
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            });
        });
        it("Should remove one PostDislike", function(done) {
          PostDislike.countDocuments({}, (error, count) => {
            expect(count).to.equal(PostDislikes - 1);
            PostDislikes = count;
            done();
          });
        });
      });
      describe("User removing a Dislike from a Post they did NOT dislike", function() {
        it("Should NOT be able to remove Dislike a Post which user didn't dislike", function(done) {
          chai.request(app)
            .delete("/api/posts/remove_dislike/" + post._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(response).to.have.status(400)
              done();
            });
        });
        it("Should NOT decrement Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(dislikeCount);
              done();
            })
            .catch((error) => {
              console.error(error);
              done();
            });
        });
        it("Should NOT remove a PostDislike", function(done) {
          PostDislike.countDocuments({}, (error, count) => {
            expect(count).to.equal(PostDislikes);
            done();
          });
        });
      });
    });
  });
  // end logged in user tests //
});
