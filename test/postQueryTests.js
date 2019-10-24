import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import seedDB from "./seeds/seedDB.js";
chai.use(chaiHttp);

import {rewind} from "../helpers/timeHelpers.js";
import {postSearchOptions} from "../controllers/controller_helpers/queryOptions.js";
import {POST_CON_UPPER, POST_CON_LOWER} from "../controllers/controller_helpers/controllerConstants";

import {seedPosts, likePosts, createControversialPosts} from "./helpers/postHelpers.js";
import User from "../models/User.js";

describe("Post Query Tests", function() {
  before("Set up database", function(done) {
    this.timeout(40000);
    seedDB({
      numberOfUsers: 25,
      numberOfPostsPerUser: 1,
      maxCommentsPerPost: 10,
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
  before("Create some controversial Post(s)", function(done) {
    this.timeout(15000);
    console.log("Creating controversial Posts");
    User.find({})
    .then((users) => {
      return Promise.all([
        createControversialPosts(users, 3, rewind.withinOneDay()),
        createControversialPosts(users, 3, rewind.withinOneWeek()),
        createControversialPosts(users, 3, rewind.withinOneMonth()),
        createControversialPosts(users, 3, rewind.withinOneYear())
      ]);
    })
    .then((posts) => {
      console.log("Finished");
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
        for(let i = 1; i < posts.length; i++) {
          expect(new Date(posts[i-1].createdAt)).to.be.gte(new Date(posts[i].createdAt));
        }
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
        for(let i = 1; i < posts.length; i++) {
          expect(new Date(posts[i-1].createdAt)).to.be.gte(new Date(posts[i].createdAt));
        }
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
        for (const post of posts) {
          expect(new Date(post.createdAt)).to.be.gte(oneDayAgo);
        }
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
  // controversial Post(s) //
  describe("GET {controversial} Post(s)", function() {
    describe("General GET request for {controversial} Post(s) without a date", function() {
      let posts = [];
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.controversial})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an('array');
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return sorted Post(s) by controversy", function(done) {
        // controversy is as close to 1 as possible from left or right
        for (let i = 1; i < posts.length; i++) {
          let a = Math.abs(posts[i-1].controversyIndex - 1);
          let b = Math.abs(posts[i].controversyIndex - 1);
          expect(a).to.be.lte(b);
        }
        done();
      });
    });
    // within a day //
    describe("GET {controversial} Post(s) within a day", function() {
      let posts = [], newPosts = [];
      const limit = 5;
      before("create new not controversial posts",  function(done) {
        let usersArr;
        User.find({}).limit(5).lean()
          .then((users) => {
            usersArr = users;
            return seedPosts(2, users, rewind.withinOneDay);
          })
          .then((posts) => {
            newPosts = [...posts];
            return likePosts(posts, usersArr, rewind.withinOneDay);
          })
          .then((numOfLikes) => {
            done()
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneDay()})
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
        for (const post of posts) {
          expect(new Date(post.createdAt)).to.be.gte(oneDayAgo);
        }
        done();
      });
      it("Should return sorted Post(s) by Post.controversyIndex in descending order", function(done) {
        for (let i = 1; i < posts.length; i++) {
          let a = Math.abs(posts[i-1].controversyIndex - 1);
          let b = Math.abs(posts[i].controversyIndex - 1);
          expect(a).to.be.lte(b);
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
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneDay(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          })
      });
      it("Should not include any new not controversial Post(s)", function(done) {
        for (const post of posts) {
          for (const newPost of newPosts) {
            expect(newPost._id.toString()).to.not.equal(post._id.toString());
          }
        }
        done();
      });
    });
    // done within a day //
    // within a week //
    describe("GET {controversial} Posts(s) within a week", function() {
      let posts = [];
      const limit = 5;
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneWeek()})
          .end((error, response) => {
            if(error) {done(error)};
            expect(error).to.null;
            expect(response).to.have.status(200)
            expect(response.body.posts).to.be.an("array");
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Post(s) within a week", function(done) {
        const aWeekAgo = rewind.goBackOneWeek();
        for (const post of posts) {
          expect(new Date(post.createdAt)).to.be.gte(aWeekAgo);
        }
        done();
      });
      it("Should only return Posts which fall within a controversy index", function(done) {
        for (const post of posts) {
          let controversyInd = post.controversyIndex;
          expect(controversyInd).to.satisfy(function(controversyInd) {
            if((controversyInd >= POST_CON_LOWER) && (controversyInd <= POST_CON_UPPER)) {
              return true;
            }
            else {
              console.log(controversyInd);
              return false;
            }
          });
        }
        done();
      });
      it("Should sort the Post(s) by controversy", function(done) {
        for (let i = 1; i < posts.length; i ++) {
          let a = Math.abs(posts[i-1].controversyIndex - 1);
          let b = Math.abs(posts[i].controversyIndex - 1);
          expect(a).to.be.lte(b);
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
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneWeek(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          })
      });
    });
    // end within a week //
    // within a month //
    describe("GET {conntroversial} Post(s) within a month", function() {
      let posts = [];
      const limit = 5;
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneMonth()})
          .end((error, response) => {
            if(error) {done(error)};
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Posts(s) dated within a month", function(done) {
        let aMonthAgo = rewind.goBackOneMonth();
        for (const post of posts) {
          expect(new Date(post.createdAt)).to.be.gte(aMonthAgo);
        }
        done();
      });
      it("Should only return Post(s) which fall within a controversy index", function(done) {
        for (const post of posts) {
          let controversyIndex = post.controversyIndex;
          expect(controversyIndex).to.satisfy(function(controversyIndex) {
            if((controversyIndex >= POST_CON_LOWER) || (controversyIndex <= POST_CON_UPPER)) {
              return true;
            }
            else {
              console.log(controversyIndex);
              return false;
            }
          });
        }
        done();
      });
      it("Should sort the Post(s) by controversy", function(done) {
        for (let i = 1; i < posts.length; i++) {
          let a = Math.abs(posts[i-1].controversyIndex - 1);
          let b = Math.abs(posts[i].controversyIndex - 1);
          expect(a).to.be.lte(b);
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
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneMonth(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          })
      });
    });
    // end within a month //
    // within a year //
    describe("Get {controversial} Post(s) within a year", function() {
      let posts = [];
      const limit = 5;
      it("Should return a Post(s) Array", function(done) {
        chai.request(app)
          .get("/api/posts")
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneYear()})
          .end((error, response) => {
            if(error) {done(error)};
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            posts = [...response.body.posts];
            done();
          });
      });
      it("Should return Posts(s) dated within a year", function(done) {
        let aYearAgo = rewind.goBackOneYear();
        for (const post of posts) {
          expect(new Date(post.createdAt)).to.be.gte(aYearAgo);
        }
        done();
      });
      it("Should only return Post(s) which fall within a controversy index", function(done) {
        for (const post of posts) {
          let controversyIndex = post.controversyIndex;
          expect(controversyIndex).to.satisfy(function(controversyIndex) {
            if((controversyIndex >= POST_CON_LOWER) || (controversyIndex <= POST_CON_UPPER)) {
              return true;
            }
            else {
              console.log(controversyIndex);
              return false;
            }
          });
        }
        done();
      });
      it("Should sort the Post(s) by controversy", function(done) {
        for (let i = 1; i < posts.length; i++) {
          let a = Math.abs(posts[i-1].controversyIndex - 1);
          let b = Math.abs(posts[i].controversyIndex - 1);
          expect(a).to.be.lte(b);
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
          .query({filter: postSearchOptions.filter.controversial, fromDate: rewind.goBackOneYear(), limit: limit})
          .end((error, response) => {
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.posts).to.be.an("array");
            expect(response.body.posts.length).to.equal(limit);
            done();
          })
      });
    })
    // end a year //
  });
});
