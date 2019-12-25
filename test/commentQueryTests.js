import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import app from "../server";

import { rewind } from  "../helpers/timeHelpers";
import { COMMENT_QUERY_OPTIONS } from "../controllers/controller_helpers/controllerConstants";

chai.use(chaiHTTP);

describe("Comment Query Tests", function() {
  // new Comment(s) //
  describe("GET /api/comments", function()  {
    describe("A request with no params", () => {
      let comments= [];
      it("Should return a new Comment(s) Array", function(done) {
        chai.request(app)
          .get("/api/comments")
          .end((error, response) => {
            if (error) return done(error);
            // expected response //
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(reponse.body.posts).to.be.an("array");
            comments = [...response.body.comments];
            done();
          });
      });
      it("Should return Comment(s) sorted by date", function(done) {
        for (let i = 1; i < comments.length; i++) {
          expect(new Date(posts[i-1].createdAt)).to.be.gte(new Date(posts[i].createdAt));
        }
        done();
      });
      it("Should have a defauly limit of 10", function(done) {
        expect(comments.length).to.equal(10);
      });
    });

    describe("A request with params", function() {
      let comments = [];
      const limit = 25, filter = "new";
      it("Should return a Comment(s) Array", function(done) {
        chai.request(app)
          .get("/api/comments")
          .query({filter: filter, limit: limit})
          .end((error, response) => {
            if (error) return done(error);
            // expected response //
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.comments).to.be.an('array');
            comments = [...response.body.comments];
            done();
          });
      });
      it("Should return a sorted Comment(s) response by Date", function(done) {
        for(let i = 1; i < comments.length; i++) {
          expect(new Date(comments[i-1].createdAt)).to.be.gte(new Date(comments[i].createdAt));
        }
        done();
      });
      it("Should return the specified query limit", function(done) {
        expect(comments.length).to.equal(limit);
        done();
      });
    });
  });
  // END {new} Comment(s) API tests //
  // {controversial} Comments(s) API tests //
  describe("GET {controversial} Comment(s)", function() {
    describe("General GET request for {controversial} Comment(s) without a date", function() {
      let comments = [];
      it("Should return a Comment(s) Array", function(done) {
        chai.request(app)
          .get("/api/comments")
          .query({filter: COMMENT_QUERY_OPTIONS.filter.controversial})
          .end((error, response) => {
            if (error) return done(error);
            // expected response //
            expect(error).to.be.null;
            expect(response).to.have.status(200);
            expect(response.body.comments).to.be.an('array');
            comments = [...response.body.comments];
            done();
          });
      });
      it("Should return sorted Comment(s) by controversy", function(done) {
        // controversy is as close to 1 as possible from left or right
        for (let i = 1; i < comments.length; i++) {
          let a = Math.abs(comments[i-1].controversyIndex - 1);
          let b = Math.abs(comments[i].controversyIndex - 1);
          expect(a).to.be.lte(b);
        }
        done();
      });
    });
    // within a day //
    describe("GET {controversial} Comment(s) within a day", function() {
      let comments = [], newComments = [];
      const limit = 5;
      before("create new not controversial comments",  function(done) {

      });
      
    });
  });
  // END {controversail} Comment(s) API tests //
})