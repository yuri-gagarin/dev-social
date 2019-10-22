import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import Post from "../models/Post.js";

import {createPost} from "./helpers/postHelpers.js";
import seedDB from "./seeds/seedDB.js";
import PostLike from "../models/PostLike.js";
import PostDislike from "../models/PostDislike.js";
import { calcControversy } from "../controllers/controller_helpers/likeHelpers.js";

chai.use(chaiHttp);

describe("PostLike Tests", function() {
  let user, userToken;
  before("Populate DB", function(done) {
    this.timeout(10000);
    seedDB({numberOfUsers: 1, numberOfPostsPerUser: 1, maxCommentsPerPost: 0})
      .then((result) => {
        user = result.users.firstUser;
        done();
      })
      .catch((error) => {
        done(error);
      })
  });
  before("Login User", function(done) {
    chai.request(app)
      .post("/api/users/login")
      .send({email: user.email, password: user.password})
      .end((error, response) => {
        if (error) {
          done(error);
        }
        userToken = response.body.token;
        done();
      })
  });

  //Guest user tests - not logged in //
  describe("A guest User", function() {
    let post1, post1LikeCount, post1ControversyIndex, PostLikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((post) => {
          post1 = post
          post1LikeCount = post.likeCount;
          post1ControversyIndex = post.controversyIndex;
          return PostLike.countDocuments({});
        })
        .then((value) => {
          PostLikes = value;
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
    
    describe("POST /api/posts/like_post", function() {
      it("Should NOT be able to like a Post", function(done) {
        chai.request(app)
          .post("/api/posts/like_post/" + post1._id)
          .end((error, response) => {
            expect(error).to.be.null;
            console.info(response.status);
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT increment Post.likeCount", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.likeCount).to.equal(post1LikeCount);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Shoult NOT change the Post.controversyIndex", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.controversyIndex).to.equal(post1ControversyIndex);
            done();
          })
          .catch((error) => {
            done(error);
          });
      })
      it("Should NOT add a PostLike", function(done) {
        PostLike.countDocuments({})
          .then((value) => {
            expect(value).to.equal(PostLikes);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });

    describe("DELETE, /api/posts/unlike_post", function() {
      it("Should NOT be able to unlike a Post", function(done) {
        chai.request(app)
          .delete(("/api/posts/unlike_post" + post1._id))
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      })
      it("Should NOT decrement Post.likeCount", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.likeCount).to.equal(post1LikeCount);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove a PostLike", function(done) {
        PostLike.countDocuments({})
          .then((value) => {
            expect(value).to.equal(PostLikes);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });
  });
  // end guest user //
  // Logged in User tests //
  describe("A logged in User", function() {
    let post1, post2, post1LikeCount, post2LikeCount, 
        post1ControversyIndex, post2ControversyIndex,
        post2DislikeCount,  PostLikes, PostDislikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((createdPost) => {
          post1 = createdPost;
          post1LikeCount = createdPost.likeCount;
          post1ControversyIndex = createdPost.controversyIndex;
          return PostLike.countDocuments({});
        })
        .then((value) => {
          PostLikes = value;
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
    describe("POST /api/posts/like_post/:postId", function() {
      describe("User liking an unliked Post ", function() {
        it("Should be able to Like a Post", function(done) {
          chai.request(app)
            .post("/api/posts/like_post/" + post1._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response.body.post).to.not.be.null;
              done();
            });
        });
        it("Should increment number of Post.likeCount by 1", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.likeCount).to.equal(post1LikeCount + 1);
              //set for delete test;
              post1LikeCount = post.likeCount;
              done();
            })
            .catch((error) => {
              done(error);
            })
        });
        it("Should change the Post.controversyIndex", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.controversyIndex).to.be.a("number");
              expect(post.controversyIndex).to.not.equal(post1ControversyIndex);
              post1ControversyIndex = post.controversyIndex;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should add a PostLike", function(done) {
          PostLike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostLikes + 1);
              PostLikes = value;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
      });
      // A Post which was disliked
      describe("User liking Post they disliked", function() {
        before("Create a disliked Post", function(done) {
          createPost(user)
            .then((post) => {
              post2 = post;
              return PostDislike.create({postId: post._id, userId: user._id});
            })
            .then((response) => {
              post2.dislikeCount += 1;
              post2.controversyIndex = calcControversy({likeCount: post2.likeCount, dislikeCount: post2.dislikeCount});
              return post2.save();
            })
            .then((post) => {
              post2DislikeCount = post.dislikeCount;
              post2LikeCount = post.likeCount;
              post2ControversyIndex = post.controversyIndex;
              return PostDislike.countDocuments({});
            })
            .then((value) => {
              PostDislikes = value;
              done();
            })
            .catch((error) => {
              done(error);
            })
        });
        it("Should be able to like the Post", function(done) {
          chai.request(app)
            .post(("/api/posts/like_post/" + post2._id))
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response.body.error).to.not.be.an("object");
              expect(response.body.post).to.not.be.null;
              done();
            });
        });
        it("Should remove a PostDislike", function(done) {
          PostDislike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostDislikes - 1);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should decrement number of Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post2._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(post2DislikeCount - 1);
              post2DislikeCount = post.dislikeCount;
              done();
            })
            .catch((error) => {
              done(error);
            })
        });
        it("Should increment number of Post.likeCount by 1", function(done) {
          Post.findOne({_id: post2._id})
            .then((post) => {
              expect(post.likeCount).to.equal(post2LikeCount + 1);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should change Post.controversyIndex", function(done) {
          Post.findOne({_id: post2._id})
            .then((post) => {
              expect(post.controversyIndex).to.be.a("number");
              expect(post.controversyIndex).to.not.equal(post2ControversyIndex);
              post2ControversyIndex = post.controversyIndex;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should add a PostLike", function(done) {
          PostLike.countDocuments()
            .then((value) => {
              expect(value).to.equal(PostLikes + 1);
              PostLikes = value;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
       
      });
      // end disliked Post
      // A liked Post
      describe("User liking a Post they already liked", function() {
        it("Should NOT be able to like the same Post", function(done) {
          chai.request(app)
            .post("/api/posts/like_post/" + post1._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(400);
              done();
            });
        });
        it("Should NOT increment number of Post.likeCount", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.likeCount).to.equal(post1LikeCount);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should NOT change the Post.controversyIndex", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.controversyIndex).to.be.a("number")
              expect(post.controversyIndex).to.equal(post1ControversyIndex);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should NOT add a PostLike", function(done) {
          PostLike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostLikes);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
      });
    });
    describe("DELETE /api/posts/unlike_post/:postId", function() {
      describe("User unliking a post they liked", function() {
       
        it("Should be able to unlike a post", function(done) {
          chai.request(app)
            .delete("/api/posts/unlike_post/" + post1._id)
              .set({"Authorization": userToken})
              .end((error, response) => {
                expect(error).to.be.null;
                expect(response.body.post).to.not.be.null;
                expect(response).to.have.status(200);
                done();
              })
        });
        it("Should decrement Post.likeCount by 1", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.likeCount).to.equal(post1LikeCount - 1);
              post1LikeCount = post.likeCount;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should change the Post.controversyIndex", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.controversyIndex).to.not.equal(post1ControversyIndex);
              post1ControversyIndex = post.controversyIndex;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should remove one PostLike", function(done) {
          PostLike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostLikes - 1);
              PostLikes = value;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
      });
      describe("User unliking a post they did NOT like", function() {
        it("Should NOT be able to unlike a Post which user didn't like", function(done) {
          chai.request(app)
            .delete("/api/posts/unlike_post/" + post1._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(400)
              done();
            });
        });
        it("Should NOT decrement Post.likeCount by 1", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.likeCount).to.equal(post1LikeCount);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Shoult NOT change Post.controversyIndex", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.controversyIndex).to.equal(post1ControversyIndex);
              done();
            })
            .catch((error) => {
              done(error);
            });
        })
        it("Should NOT remove a PostLike", function(done) {
          PostLike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostLikes);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
      });
    });
  });
  // end logged in user tests //
});
