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

describe("PostDislike Tests", function() {
  this.timeout(10000);
  let user, userToken;
  before("Populate DB", function(done) {
    seedDB({
      numberOfUsers: 1, 
      numberOfPostsPerUser: 0, 
      maxCommentsPerPost: 0,
      withinADay: true,
      })
      .then((result) => {
        user = result.users.firstUser;
        done();
      })
      .catch((error) => {
        done(error);
      })
  });;
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
  describe("A guest User", function() {
    let post1, dislikeCount, postControversyIndex, PostDislikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((post) => {
          post1 = post
          dislikeCount = post.dislikeCount;
          postControversyIndex = post.controversyIndex;
          return  PostDislike.countDocuments({});
        })
        .then((value) => {
          PostDislikes = value;
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
    
    describe("POST /api/posts/dislike_post/:postId", function() {
      it("Should NOT be able to dislike a Post", function(done) {
        chai.request(app)
          .post("/api/posts/dislike_post/" + post1._id)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT increment Post.dislikeCount", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.dislikeCount).to.equal(dislikeCount);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT change Post.controversyIndex", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.controversyIndex).to.equal(postControversyIndex);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT add a PostDislike", function(done) {
        PostDislike.countDocuments({})
          .then((value) => {
            expect(value).to.equal(PostDislikes);
            done();
          })
          .catch((error) => {
            done(error);
          })
      });
    });
    describe("DELETE, /api/posts/remove_dislike/:postId", function() {
      it("Should NOT be able to unlike a Post", function(done) {
        chai.request(app)
          .delete(("/api/posts/remove_dislike" + post1._id))
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT decrement Post.dislikeCount", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.dislikeCount).to.equal(dislikeCount);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT change Post.controversyIndex", function(done) {
        Post.findOne({_id: post1._id})
          .then((post) => {
            expect(post.controversyIndex).to.equal(postControversyIndex);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove a PostDislike", function(done) {
        PostDislike.countDocuments({})
          .then((value) => {
            expect(value).to.equal(PostDislikes);
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
    let post1, post2, post1DislikeCount, post2DislikeCount, 
    post1ControversyIndex, post2ControversyIndex,
    post2LikeCount, PostDislikes, PostLikes;
    before("Create a Post", function(done) {
      createPost(user)
        .then((post) => {
          post1 = post;
          post1DislikeCount = post.dislikeCount;
          post1ControversyIndex = post.controversyIndex;
          done();
        })
        .catch((error) =>{
          done(error);
        });
    });
    before("Count PostsDislike model", function(done) {
      PostDislike.countDocuments({})
        .then((value) => {
          PostDislikes = value;
          done();
        })
        .catch((error) => {
          done(error);
        })
    });
    describe("POST /api/posts/dislike_post/:postId", function() {
      describe("User disliking a new Post ", function() {
        it("Should be able to Dislike a Post", function(done) {
          chai.request(app)
            .post("/api/posts/dislike_post/" + post1._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response.body.error).to.not.be.an("object");
              expect(response.body.post).to.not.be.null;
              done();
            });
        });
        it("Should increment number of Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(post1DislikeCount + 1);
              post1DislikeCount = post.dislikeCount;
              done();
            })
            .catch((error) => {
              done(error);
            });
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
        it("Should add a PostDislike", function(done) {
          PostDislike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostDislikes + 1);
              PostDislikes = value;
              done();
            })
            .catch((error) => {
              done(error);
            })
        });
      });
      describe("User DISLIKING a Post they LIKED", function() {
        before("Create a Post and add a PostLike", function(done) {
          createPost(user)
            .then((post) => {
              post2 = post;
              return PostLike.create({postId: post2._id, userId: user._id})
            })
            .then((response) => {
              post2.likeCount +=1;
              post2.controversyIndex = calcControversy({likeCount: post2.likeCount, dislikeCount: post2.dislikeCount});
              return post2.save();
            })
            .then((post) => {
              post2DislikeCount = post.dislikeCount;
              post2LikeCount = post.likeCount;
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
        it("Should be able to dislike a Post", function(done) {
          chai.request(app)
            .post("/api/posts/dislike_post/" + post2._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(200);
              expect(response.body.post).to.not.be.null;
              done();
            })
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
            })
        });
        it("Should decrement Post.likeCount by 1", function(done) {
          Post.findOne({_id: post2._id})
            .then((post) => {
              expect(post.likeCount).to.equal(post2LikeCount - 1);
              post2LikeCount = post.likeCount;
              done();
            })
            .catch((error) => {
              done(error);
            })
        }); 
        it("Should add one PostDislike", function(done) {
          PostDislike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostDislikes + 1);
              PostDislikes = value;
              done();
            })
            .catch((error) => {
              done(error);
            })
        });
        it("Should increment Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post2._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(post2DislikeCount + 1);
              post2DislikeCount = post.dislikeCount;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should change the Post.controversyIndex", function(done) {
          Post.findOne({_id: post2.id})
            .then((post) => {
              expect(post.controversyIndex).to.be.a("number");
              expect(post.controversyIndex).to.not.equal(post2.controversyIndex);
              post2ControversyIndex = post.controversyIndex;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
      });
      describe("User DISLIKING a Post they already DISLIKED", function() {
        it("Should NOT be able to dislike the same Post", function(done) {
          chai.request(app)
            .post("/api/posts/dislike_post/" + post1._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(error).to.be.null;
              expect(response).to.have.status(400);
              done();
            });
        });
        it("Should NOT increment number of Post.dislikeCount", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(post1DislikeCount);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should NOT add a PostDislike", function(done) {
          PostDislike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostDislikes);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should NOT change the Post.controversyIndex", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.controversyIndex).to.be.a("number");
              expect(post.controversyIndex).to.equal(post1ControversyIndex);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
      });
    });
    describe("DELETE /api/posts/dislike_post/:postId", function() {
      describe("User removing a dislike from a Post they disliked", function() {
        it("Should be able to remove a Dislike", function(done) {
          chai.request(app)
            .delete("/api/posts/remove_dislike/" + post1._id)
              .set({"Authorization": userToken})
              .end((error, response) => {
                expect(error).to.be.null;
                expect(response.body.error).to.not.be.an("object");
                expect(response.body.post).to.not.be.null;
                expect(response).to.have.status(200);
                done();
              })
        });
        it("Should decrement Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post1.dislikeCount).to.equal(post1DislikeCount - 1);
              post1DislikeCount = post.dislikeCount;
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should remove one PostDislike", function(done) {
          PostDislike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostDislikes - 1);
              PostDislikes = value;
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
      });
      describe("User removing a Dislike from a Post they did NOT dislike", function() {
        it("Should NOT be able to remove Dislike a Post which user didn't dislike", function(done) {
          chai.request(app)
            .delete("/api/posts/remove_dislike/" + post1._id)
            .set({"Authorization": userToken})
            .end((error, response) => {
              expect(response).to.have.status(400)
              done();
            });
        });
        it("Should NOT decrement Post.dislikeCount by 1", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.dislikeCount).to.equal(post1DislikeCount);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should NOT remove a PostDislike", function(done) {
          PostDislike.countDocuments({})
            .then((value) => {
              expect(value).to.equal(PostDislikes);
              done();
            })
            .catch((error) => {
              done(error);
            });
        });
        it("Should NOT change the Post.controversyIndex", function(done) {
          Post.findOne({_id: post1._id})
            .then((post) => {
              expect(post.controversyIndex).to.equal(post1ControversyIndex);
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
