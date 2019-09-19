import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import faker from "faker";
import Post from "../models/Post.js";
import {generatePost} from "./helpers/postHelpers.js";
import seedDB from "./seeds/seedDB.js";
import mongoose from "mongoose";
chai.use(chaiHttp);


describe("Post Tests", function() {
  let firstUser, secondUser, moderator, administrator;
  let firstUserToken, moderatorToken, administratorToken;
  let firstUsersPost, secondUsersPost;
  let postCount;
  before("Populate DB", function(done) {
    this.timeout(10000);
    seedDB({numberOfUsers: 5, numberOfPostsPerUser: 5, maxCommentsPerPost: 5})
      .then((response) => {
        ({firstUser, secondUser, moderator, administrator} = response.users);
        done();
      })
      .catch((error) => {
        console.error(error);
      });
  });
  before("Login User", function(done) {
    chai.request(app)
      .post("/api/users/login")
      .send({email: firstUser.email, password: firstUser.password})
      .end((error, response) => {
        firstUserToken = response.body.token;
        done();
      })
  })
  before("Log in Moderator", function(done) {
    chai.request(app)
      .post("/api/users/login")
      .send({email: moderator.email, password: moderator.password})
      .end((error, response) => {
        if (error) console.error(error);
        moderatorToken = response.body.token
        done();
      });
  });
  // get posts //
  before("Set posts", function(done) {
    Post.find({user: firstUser._id})
      .then((posts) => {
        firstUsersPost = posts[0];
        return Post.find({user: secondUser._id})
      })
      .then((posts) => {
        secondUsersPost = posts[0];
        done();
      })
      .catch((error) => {
        console.error(error);
      });
  });
  
  // count all posts in database //
  before("Get Post count", function(done) {
    Post.countDocuments({}, (err, count) => {
      if(err) {console.error(err)};
      postCount = count;
      done();
    })
  })
  // clean up data and exit //
  after("Clean database and close", function(done) {
    mongoose.connection.db.dropDatabase()
      .then((response) => {
        return mongoose.connection.close();
      })
      .then((response) => {
        done();
      })
      .catch((error) => {
        console.error(error);
        done();
      });
  });
  // guest or not logged in //
  describe("A guest User", function() {
    const newPost = generatePost();
    describe("GET /api/posts", function() {
      it("Should be able to read all posts", function(done) {
        chai.request(app)
          .get("/api/posts")
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.not.be.null;
            done();
          })
      });
    });
    describe("POST /api/posts", function() {
      it("Should NOT be able to create a new post", function(done) {
        chai.request(app)
          .post("/api/posts")
          .send({...newPost, userId: firstUser._id})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            expect(response.text).to.equal("Unauthorized");
            done();
          });
      });
      it("Should NOT increase the number of Post(s)", function(done) {
        Post.countDocuments({}, (err, count) => {
          if(err) {console.error(err)};
          expect(count).to.equal(postCount);
          done();
        });
      });
    });
    describe("PATCH /api/posts/:id", function() {
      const newTitle = "A new Title";
      it("Should NOT be able to EDIT a post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + firstUsersPost._id)
          .send({title: newTitle})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            expect(response.text).to.equal("Unauthorized");
            done();
          })
      });
      it("Should NOT change the Post data", function(done) {
        Post.findOne({_id: firstUsersPost._id})
          .then((post) => {
            expect(post.title).to.not.equal(newTitle);
            done();
          })
          .catch((error) => {
            console.error(error);
          })
      })
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should not be able to delete a post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + firstUsersPost._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.text).to.equal("Unauthorized");
            done();
          });
      });
      it("Should NOT decrease the number of Post(s)", function(done) {
        Post.countDocuments({}, (err, count) => {
          if(err) {console.error(err)};
          expect(count).to.equal(postCount);
          done();
        })
      })
    });
  });
  // end guest user tests //
  // regular logged in user //
  describe("User Logged in", function() {
    let mockPost;
    before("Create a mock Post", function(done) {
      mockPost = generatePost();
      done();
    });
    describe("POST /api/posts", function() {
      it("Should be able to Create a post", function(done) {
        chai.request(app)
          .post("/api/posts")
          .set({'Authorization': firstUserToken})
          .send(mockPost)
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.post).to.not.be.null;
            done();
          });
      });
      it("Should increment number of Post(s) by 1", function(done) {
        Post.countDocuments({}, (err, count) => {
          if (err) {console.error(err)};
          expect(count).to.equal(postCount + 1);
          postCount = count;
          done()
        })
      })
    })
    describe("PATCH /api/posts/:id", function () {
      let editedTitle = faker.lorem.sentence();
      it("Should be able to EDIT own Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + firstUsersPost._id)
          .set({"Authorization": firstUserToken})
          .send({title: editedTitle})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.post).to.not.be.null;
            done();
          });
      });
      it("Should edit the Post data", function(done) {
        Post.findOne({_id: firstUsersPost._id})
          .then((post) => {
            expect(post.title).to.equal(editedTitle);
            done();
          })
          .catch((error) => {
            console.error(error);
          })
      })
      it("Shoud NOT create a new Post when editing own Post", function(done) {
        Post.countDocuments({}, (err, count) => {
          if (err) {console.error(err)};
          expect(count).to.equal(postCount);
          done();
        })
      })
      it("Should NOT be able to EDIT other User's Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + secondUsersPost._id)
          .set({"Authorizaton": firstUserToken})
          .send({text: "Edited Text"})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401); 
            done();
          });
      });
      it("Should NOT edit the other User's Post data", function(done) {
        let editedTitle = faker.lorem.sentence();
        chai.request(app)
          .patch("/api/posts/" + secondUsersPost._id)
          .set({"Authorizaton": firstUserToken})
          .send({title: editedTitle})
          .end((error, response) => {
            Post.findOne({_id: secondUsersPost._id})
              .then((post) => {
                expect(post.title).to.not.equal(editedTitle);
                done();
              })
              .catch((error) => {
                console.error(error);
              });
          });
      })
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should be able to DELETE own Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + firstUsersPost._id)
          .set({"Authorization": firstUserToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            done();
          });
      });
      it("Should decrease the number of Post(s) by 1", function(done) {
        Post.countDocuments({}, (err, count) => {
          if(err) {console.error(err)};
          expect(count).to.equal(postCount - 1);
          postCount = count;
          done();
        });
      });
      it("Should NOT be able to DELETE other User's Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + secondUsersPost._id)
          .set({"Authorization": firstUserToken})
          .end((error, response) =>{
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT decrease the number of Posts", function(done) {
        Post.countDocuments({}, (err, count) => {
          if(err) {console.error(err)};
          expect(count).to.equal(postCount);
          done();
        });
      });
    });
  });
  // end Logged in User //

  // moderator Logged in //
  describe("Moderator Logged in", function () {
    
    describe("PATCH /api/posts/:id", function() {
      const newTitle = faker.lorem.sentence;
      it("Should NOT be able to EDIT another User's Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + secondUsersPost._id)
          .set({"Authorization": moderatorToken})
          .send({title: newTitle})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      });
      it("Should NOT change another User's Post data", function(done) {
        Post.findOne({_id: secondUsersPost._id})
          .then((post) => {
            expect(post.title).to.not.equal(newTitle);
            done();
          })
          .catch((error) => {
            console.error(error);
          });
      })
      it("Should NOT change the number of Posts(s)", function(done) {
        Post.countDocuments({}, (err, count) => {
          if(err) {console.error(err)};
          expect(count).to.equal(postCount);
          done();
        });
      });
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should be able to DELETE another User's Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + secondUsersPost._id)
          .set({"Authorization": moderatorToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            done();
          });
      });
      it("Should decrease the number of Posts(s) by 1", function(done) {
        Post.countDocuments({}, (err, count) => {
          if(err) {console.error(err)};
          expect(count).to.equal(postCount - 1);
          postCount = count;
          done();
        });
      });
    });
  });
  // end moderator tests //

  // administrator tests //
});