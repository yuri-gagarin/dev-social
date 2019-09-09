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
  let users;
  before("Clean database", async function() {
    try {
      await User.deleteMany({});
      await Post.deleteMany({});
    }
    catch(error) {
      console.log(error);
    }
  })
  before("Create Users", async function() {
    users = generateUserData(4);
    try {
      const userResult = await createUsers(users, "/api/users/register");
      const postUser = await User.findOne({email: users[0].email});
      const postResult = await createPosts(2, postUser);
    }
    catch (error) {
      console.error(error);
    }
  });
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
  describe("User not logged in", function() {
    const invalidPost = generatePost();
    let post, user;
    before("Get Post", async function() {
      user = await User.find({email: users[3].email});
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
    it("Should not be able to edit a post", function(done) {
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
  //regular user
  describe("User logged in and owns Post", function(done) {
    let user, post, jwtToken;
    before("Find user and post", async function() {
      user = User.findOne({email: users[0].email});
      post = Post.findOne({user: user._id});
    })
    before("Login User", async function() {
      chai.request(app)
        .post("/api/users/login")
        .send({email: users[0].email, password: users[0].password})
        .end((error, response) => {

        })
    })
    it("Should be able to read a post", function(done) {

    });
    it("Should be able to create a post", function(done) {

    });
    it("Should be able to edit own post", function(done) {

    });
    it("Should not be able to edit someones post", function(done) {

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
    it("Should be able to edit own post", function(done) {

    });
    it("Should not be able to edit someones post", function(done) {

    });
    it("Should be able to delete own post", function(done) {

    });
    it("Should be able to delete someones post", function(done) {

    });
  })
});