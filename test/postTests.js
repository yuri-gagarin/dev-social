import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../models/User.js";
import faker from "faker";
import Post from "../models/Post.js";

import axios from "axios";

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
      await User.deleteMany({});
      await Post.deleteMany({});
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
      const postUser = await User.findOne({email: firstUser.email});
      const postResult = await createPosts(2, postUser);
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
      post = await Post.find({}).sort({createdAt: "DESC"}).limit(1);
    });

    it("Should be able to read all posts", function(done) {
      chai.request(app)
        .get("/api/posts")
        .end((error, response) => {
          const postResponse = JSON.parse(response.text);
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(postResponse.posts).to.not.be.null;
          done();
        })
    });
    it("Should not be able to create a new post", function(done) {
      chai.request(app)
        .post("/api/posts")
        .send(invalidPost)
        .end((error, response) => {
          //const postResponse = JSON.parse(response.text);
          expect(response).to.have.status(401);
          done();
        });
    });
    it("Should not be able to EDIT a post", function(done) {
      chai.request(app)
        .patch("/api/posts/" + post._id)
        .send({title: "A new title"})
        .end((error, response) => {
          expect(response).to.have.status(401);
          done();
        })
    });
    it("Should not be able to delete a post", function(done) {
      chai.request(app)
        .delete("/api/posts/" + post._id)
        .end((error, respose) => {
          expect(response).to.have.status(401);
          done();
        });
    });
  });

  //regular logged in user
  describe("Logged in User", function(done) {
    let postUser, usersPost, otherUser, otherPost, postUserToken, otherUserToken, mockPost;

    before("Set test data", async function() {
      mockPost = {
        title: faker.lorem.word,
        text: faker.lorem.paragraphs(2),
      };
      postUser = await User.findOne({email: firstUser.email});
      usersPost = await Post.findOne({user: postUser._id});
      otherUser = await User.findOne({email: secondUser.email});
      otherPost = await Post.findOne({user: otherUser._id});
    })
    before("Login Users", async function() {
      const options1 = {
        url: "/api/users/register",
        data: {
          email: postUser.email,
          password: postUser.password,
        }
      };
      const options2 = {
        url: "api/users/register",
        data: {
          email: otherUser.email,
          password: otherUser.password,
        }
      };
      const response1 = await axios.post(options1);
      const response2 = await axios.post(options2);
      postUserToken = response1.text.token;
      otherUserToken = response2.text.token;
    })
    describe("POST /api/posts", function() {
      it("Should be able to Create a post", function(done) {
        chai.request(app)
          .post("/api/posts")
          .headers({'Authorization': postUserToken})
          .send(mockPost)
          .end((error, response) => {
            expect(response).to.have.status(200);
            done();
          })
      })
    })
    describe("PATCH /api/posts/:id", function () {
      it("Should be able to EDIT own Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + usersPost._id)
          .headers({"Authorization": postUserToken})
          .send({text: faker.paragraphs(1)})
          .end((error, response) => {
            expect(response).to.have.status(200);
            done();
          });
      });
      it("Should NOT be able to EDIT other User's Post", function(done) {
        chai.request(app)
          .patch("/api/posts/" + otherPost._id)
          .headers({"Authorizaton": postUserToken})
          .send({text: faker.paragraphs(1)})
          .end((error, response) => {
            expect(response).to.have.status(401);
            done();
          })
      })
    });
    describe("DELETE /api/posts/:id", function() {
      it("Should be able to DELETE own Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + usersPost._id)
          .headers({"Authorization": postUserToken})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            done()
          })
      })
      it("Should not be able to DELETE other User's Post", function(done) {
        chai.request(app)
          .delete("/api/posts/" + otherPost._id)
          .headers({"Authorization": postUserToken})
          .end((error, response) =>{
            expect(response).to.have.status(401);
            done();
          })
      })
    })
    describe("Other User's Post", function () {

    });
    it("Should be able to read a post", function(done) {

    });
    it("Should be able to create a post", function(done) {

    });
    it("Should be able to EDIT own post", function(done) {

    });
    it("Should not be able to EDIT someones post", function(done) {

    });
    it("Should be able to delete own post", function(done) {

    });
    it("Should not be able to delete someones post", function(done) {

    });
  });
  //moderator
  describe("User logged in and is Moderator", function() {
    it("Should be able to read a post", function(done) {

    });
    it("Should be able to create a post", function(done) {

    });
    it("Should be able to EDIT own post", function(done) {

    });
    it("Should not be able to EDIT someones post", function(done) {

    });
    it("Should be able to delete own post", function(done) {

    });
    it("Should be able to delete someones post", function(done) {

    });
  })
});