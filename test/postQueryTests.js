import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import seedDB from "./seeds/seedDB.js";
chai.use(chaiHttp);

import {rewind} from "../helpers/timeHelpers.js";
import {postSearchOptions} from "../controllers/controller_helpers/queryOptions.js";
import {seedPosts} from "./helpers/postHelpers.js";
import User from "../models/User.js";

describe("Post Query Tests", function() {
  this.timeout(10000);
  before("Set up database", function(done) {
    seedDB({
      numberOfUsers: 5,
      numberOfPostsPerUser: 5,
      maxCommentsPerPost: 5,
      withinADay: true,
      withinAWeek: true,
      withinAMonth: true,
      withinAYear: true,
    })
    .then((data) => {
      done();
    })
    .catch((error) => {console.error(error)});
  });
  // new Post(s) //
  describe("GET {new} Post(s)", function() {
    describe("A request without any params", function() {
      let posts = [];
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return a sorted Post(s) response by Date", function(done) {
        expect(new Date(posts[0].createdAt)).to.be.greaterThan(new Date(posts[1].createdAt));
        done();
      });
      it("Should have a default limit of 10", function(done) {
        expect(posts.length).to.equal(10);
        done();
      });
    });
    describe("A request with params", function() {
      let posts = [];
      const limit = 25;
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: "new", limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return a sorted Post(s) response by Date", function(done) {
        expect(new Date(posts[0].createdAt)).to.be.greaterThan(new Date(posts[1].createdAt));
        done();
      });
      it("Should return the specified query limit", function(done) {
        expect(posts.length).to.equal(limit);
        done();
      });
    });
  });
  // end new Post(s) //
  // discussed Post(s) //
  describe("GET {discussed} Post(s)", function() {
    describe("General GET request for {discussed} Post(s)", function() {
      let posts = [];
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return sorted Post(s) by number of Comment(s) in descending order", function(done) {
        expect(posts[0].comments.length).to.be.gte(posts[1].comments.length);
        done();
      });
    });
    describe("{discussed} Post(s) within a day", function() {
      let posts = [];
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.trending, createdAt: postSearchOptions.time.day})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return sorted Post(s) by number of Comment(s) in descending order", function(done) {
        expect(posts[0].comments.length).to.be.gte(posts[1].comments.length);
        done();
      });
      it("Should return Post(s) within 24Hrs", function(done) {
        const oneDayAgo = rewind.goBackOneDay();
        posts.forEach((post) => {
          const postDate = new Date(post.createdAt);
          expect(postDate).to.be.gte(oneDayAgo);
        });
        done();
      });
      it("Should have a default limit of 10", function(done) {
        expect(posts.length).to.equal(10);
        done();
      });
    });
    describe("{discussed} Post(s) within a day with a query limit", function() {
      let posts = [], newPosts = [];
      const limit = 5;
      before("create new not discussed posts", async function() {
        try {
          const users = await User.find({}).lean();
          //these are posts not dicussed
          newPosts = await seedPosts(2, users, new Date());
        }
        catch (error) {
          console.error(error);
        }
      });
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.trending, createdAt: postSearchOptions.time.day, limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return sorted Post(s) by number of Comments in descending order", function(done) {
        expect(posts[0].comments.length).to.be.gte(posts[1].comments.length);
        done();
      });
      it("Should return Post(s) within 24Hrs", function(done) {
        const oneDayAgo = rewind.goBackOneDay();
        posts.forEach((post) => {
          const postDate = new Date(post.createdAt);
          expect(postDate).to.be.gte(oneDayAgo);
        });
        done();
      });
      it("Should return a specified query limit", function(done) {
        expect(posts.length).to.equal(limit);
        done();
      });
      it("Should not include any new less discussed posts", function(done) {
        for (const post of posts) {
          for (const newPost of newPosts) {
            expect(newPost._id.toString()).to.not.equal(post._id.toString());
          }
        }
        done();
      });
    });
  });
  // end discussed Post(s) //

  /*
  describe("GET {controversial} Post(s)", function() {
    //for later //
  })
  */
});
