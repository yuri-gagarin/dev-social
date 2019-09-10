import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../models/User.js";
import faker from "faker";
import Post from "../models/Post.js";

chai.use(chaiHttp);


/**
 * Makes an array of users.
 * @param {number} count How many users to make.
 * @returns {array} An array with generated users.
 */
function generateUserData(count) {
  const users = []
  for (let i = 1; i <= count; i++) {
    const user = {
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: "Password1",
      passwordConfirm: "Password1",
    }
    users.push(user);
  }
  return users;
};

function generatePost() {
  const post = {
    author: faker.name.findName(),
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likes: 0,
  };
  return post;
};

async function createPosts(count, user) {
  const posts = [];
  for (let i = 1; i <= count; i++) {
    const post = {
      user: user._id,
      author: user.name + " " + user.lastName,
      title: faker.lorem.word(),
      text: faker.lorem.paragraphs(2),
      likes: 0,
    };
    posts.push(post);
  }
  try {
    await Post.insertMany(posts);
    return true;
  }
  catch(err) {
    console.log(err);
    return false;
  }
};


async function createUsers(users, route) {
  const requester = chai.request(app).keepOpen();
  try {
    await Promise.all( users.map(user => requester.post(route).send(user)) );
    requester.close();
    return true;
  }
  catch(error) {
    console.log(error)
    requester.close();
    return false;
  }
};

describe("Post Tests", function() {
  let usersArr, firstUser, secondUser, thirdUser, fourthUser;
  //clean any leftover data
  before("Clean", async function() {
    try {
      const users = await User.deleteMany({});
      const posts = await Post.deleteMany({});
    }
    catch(error) {
      console.log(error);
    }
  })
  //create users and posts
  before("Populate DB", async function() {
    usersArr = generateUserData(4);
    [firstUser, secondUser, thirdUser, fourthUser] = usersArr;
    try {
      const userResult = await createUsers(usersArr, "/api/users/register");
      const postUser1 = await User.findOne({email: firstUser.email});
      const postUser2 = await User.findOne({email: secondUser.email});
      const postResult1 = await createPosts(2, postUser1);
      const postResult2 = await createPosts(2, postUser2);
    }
    catch (error) {
      console.error(error);
    }
  });
  //clean up data and exit
  after("Clean database and close", async function() {
    try {
      await User.deleteMany({});
      await Post.deleteMany({});
      process.exit(0);
    }
    catch (error) {
      console.log(error)
      process.exit(0);
    }
  })
  //guest or not logged in//
  describe("A guest User", function() {
    const invalidPost = generatePost();
    let post, user;
    before("Get Post", async function() {
      const postResponse = await Post.find({}).sort({createdAt: "DESC"}).limit(1);
      post = postResponse[0];
    });
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
      it("Should not be able to create a new post", function(done) {
        chai.request(app)
          .post("/api/posts")
          .send(invalidPost)
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.text).to.equal("Unauthorized");
            done();
          });
      });
    });
    describe("PATCH /api/posts/:id", function() {
      it("Should not be able to EDIT a post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + post._id)
          .send({title: "A new title"})
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.text).to.equal("Unauthorized");
            done();
          })
      });
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should not be able to delete a post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + post._id)
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.text).to.equal("Unauthorized");
            done();
          });
      });
    });
  });
  //end guest user tests
  //regular logged in user
  describe("User Logged in", function(done) {
    let postUser, usersPost, otherUser, otherPost, postUserToken, mockPost;
    before("Set test data", async function() {
      mockPost = {
        title: faker.lorem.word(),
        text: faker.lorem.paragraphs(2),
      };
      postUser = await User.findOne({email: firstUser.email});
      otherUser = await User.findOne({email: secondUser.email});
      usersPost = await Post.findOne({user: postUser._id});
      otherPost = await Post.findOne({user: otherUser._id});
    })
    before("Login User", function(done) {
      chai.request(app)
        .post("/api/users/login")
        .send({email: firstUser.email, password: firstUser.password})
        .end((error, response) => {
          const userResponse = JSON.parse(response.text);
          postUserToken = userResponse.token;
          done();
        })
  
    })
    describe("POST /api/posts", function() {
      it("Should be able to Create a post", function(done) {
        chai.request(app)
          .post("/api/posts")
          .set({'Authorization': postUserToken})
          .send(mockPost)
          .end((error, response) => {
            const postResponse = JSON.parse(response.text);
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(postResponse.post).to.not.be.null;
            done();
          });
      });
    })
    describe("PATCH /api/posts/:id", function () {
      it("Should be able to EDIT own Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + usersPost._id)
          .set({"Authorization": postUserToken})
          .send({text: mockPost.text})
          .end((error, response) => {
            const postResponse = JSON.parse(response.text);
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(postResponse.post).to.not.be.null;
            done();
          });
      });
      it("Should NOT be able to EDIT other User's Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + otherPost._id)
          .set({"Authorizaton": postUserToken})
          .send({text: mockPost.text})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401); 
            done();
          });
      });
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should be able to DELETE own Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + usersPost._id)
          .set({"Authorization": postUserToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            done();
          });
      });
      it("Should not be able to DELETE other User's Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + otherPost._id)
          .set({"Authorization": postUserToken})
          .end((error, response) =>{
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          });
      });
    });
  });
  //end Logged in User

  //moderator Logged in
  describe("Moderator Logged in", function () {
    let moderator, user, post, moderatorToken;
    before("Set Test Data", async function() {
      moderator = await User.findOne({email: thirdUser.email})
      moderator.role = "moderator";
      moderator = await moderator.save();
      user = await User.findOne({email: firstUser.email});
      post = await Post.findOne({user: user._id});
    })
    before("Log in Moderator", function(done) {
      chai.request(app)
        .post("/api/users/login")
        .send({email: thirdUser.email, password: thirdUser.password})
        .end((error, response) => {
          if (error) console.error(error);
          moderatorToken = response.body.token
          done();
        });
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should not be able to EDIT another User's Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + post._id)
          .set({"Authorization": moderatorToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(401);
            done();
          })
      })
      it("Should be able to DELETE another User's Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + post._id)
          .set({"Authorization": moderatorToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            done();
          });
      });
    });
  });
  //end moderator tests
});