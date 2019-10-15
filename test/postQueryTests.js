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
    .catch((error) => {
      done(error);
    });
  });
  // new Post(s) //
  describe("GET {new} Post(s) /api/posts?filter=new", function() {
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
    describe("General GET request for {discussed} Post(s) without a date", function() {
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
    // within a day //
    describe("{discussed} Post(s) within a day", function() {
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
          .query({filter: postSearchOptions.filter.discussed, fromDate: rewind.goBackOneDay()})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Post(s) within 24Hrs", function(done) {
        const oneDayAgo = rewind.goBackOneDay();
        posts.forEach((post) => {
          const postDate = new Date(post.createdAt);
          expect(postDate).to.be.gte(oneDayAgo);
        });
        done();
      });
      it("Should return sorted Post(s) by number of Comment(s) in descending order", function(done) {
        expect(posts[0].comments.length).to.be.gte(posts[1].comments.length);
        done();
      });
      it("Should have a default limit of 10", function(done) {
        expect(posts.length).to.be.lte(10);
        done();
      });
      it("Should return a specified query limit", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, fromDate: rewind.goBackOneDay(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          })
      });
      it("Should not include any new not commented posts", function(done) {
        for (const post of posts) {
          for (const newPost of newPosts) {
            expect(newPost._id.toString()).to.not.equal(post._id.toString());
          }
        }
        done();
      });
    });
    // end within a day //
    // within a week //
    describe("{discussed} Post(s) within a week", function() {
      let posts = [], newPosts = [];
      const limit = 5;
      before("create new not discussed posts", async function() {
        try {
          const users = await User.find({}).lean();
          //these are posts not dicussed
          newPosts = await seedPosts(2, users, rewind.withinOneWeek());
        }
        catch (error) {
          console.error(error);
        }
      });
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, fromDate: rewind.goBackOneWeek()})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Post(s) within last 7 days", function(done) {
        const aWeekAgo = rewind.goBackOneWeek();
        for (const post of posts) {
          const postDate = new Date(post.createdAt);
          expect(postDate).to.be.gte(aWeekAgo);
        }
        done();
      });
      it("Should return sorted Post(s) by number of Comment(s) in descending order", function(done) {
        for(let i = 0; i < posts.length; i++) {
          if(posts[i]-1) {
            expect(posts[i-1].commentsCount).to.be.gte(posts[i].commentsCount);
          }
        }
        done();
      });
      it("Should have a default limit of 10", function(done) {
        expect(posts.length).to.be.lte(10);
        done();
      });
      it("Should return a specified query limit", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, createdAt: rewind.goBackOneWeek(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          });
      });
      it("Should NOT return any not commented Post(s)", function(done) {
        for (const post of posts) {
          for (const newPost of newPosts) {
            expect(newPost._id.toString()).to.not.equal(post._id.toString());
          }
        }
        done();
      });
    });
    // end within a week //
    // within a month //
    describe("{discussed} Post(s) within a month", function() {
      let posts = [], newPosts = [];
      const limit = 5;
      before("create new not discussed posts", async function() {
        try {
          const users = await User.find({}).lean();
          //these are posts not dicussed
          newPosts = await seedPosts(2, users, rewind.withinOneMonth());
        }
        catch (error) {
          console.error(error);
        }
      });
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, fromDate: rewind.goBackOneMonth()})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Post(s) within the last 30 days", function(done) {
        const aMonthAgo = rewind.goBackOneMonth();
        for (const post of posts) {
          const postDate = new Date(post.createdAt);
          expect(postDate).to.be.gte(aMonthAgo);
        }
        done();
      });
      it("Should return sorted Post(s) by number of Comment(s) in descending order", function(done) {
        for(let i = 0; i < posts.length; i++) {
          if(posts[i]-1) {
            expect(posts[i-1].commentsCount).to.be.gte(posts[i].commentsCount);
          }
        }
        done();
      });
      it("Should have a default limit of 10", function(done) {
        expect(posts.length).to.be.lte(10);
        done();
      });
      it("Should return a specified query limit", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, createdAt: rewind.goBackOneWeek(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          });
      });
      it("Should not return any not commented Post(s)", function(done) {
        for (const post of posts) {
          for (const newPost of newPosts)  {
            expect(newPost._id.toString).to.not.equal(post._id.toString());
          }
        }
        done();
      })
    });
    // end within a month //
    // within a year //
    describe("{discussed} Post(s) within a year", function() {
      let posts = [], newPosts = [];
      const limit = 5;
      before("create new not discussed posts", async function() {
        try {
          const users = await User.find({}).lean();
          //these are posts not dicussed
          newPosts = await seedPosts(2, users, rewind.withinOneYear());
        }
        catch (error) {
          console.error(error);
        }
      });
      it("Should return a Post(s) Array", function(done) {
        chai.request(app) 
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, fromDate: rewind.goBackOneYear()})
          .end((error, response) => {
            if (error) {done(error)};
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Post(s) within the last year", function(done) {
        const oneYearAgo = rewind.goBackOneYear();
        for (const post of posts) {
          const postDate = new Date(post.createdAt)
          expect(postDate).to.be.gte(oneYearAgo);
        }
        done();
      });
      it("Should return sorted Post(s) by number of Comment(s) in descending order", function(done) {
        for (let i = 1; i < posts.length; i++) {
         expect(posts[i-1].comments.length).to.be.gte(posts[i].comments.length);
        }
        done();
      });
      it("Should have a default limit of 10", function(done) {
        expect(posts.length).to.be.lte(10);
        done();
      });
      it("Should return a specified query limit", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.discussed, createdAt: rewind.goBackOneYear(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          });
      });
      it("Should not return any not commented Post(s)", function(done) {
        for (const post of posts) {
          for (const newPost of newPosts)  {
            expect(newPost._id.toString).to.not.equal(post._id.toString());
          }
        }
        done();
      });
    });
    // end within a year //
  });
  // end {discussed} Post(s) //
});
