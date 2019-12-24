import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import app from "../server";

import { rewind } from  "../helpers/timeHelpers";
import { COMMENT_QUERY_OPTIONS } from "../controllers/controller_helpers/controllerConstants";

chai.use(chaiHTTP);

describe("Comment Query Tests", function() {
  // new Comment(s) //
  describe("GET /api/comments", function()  {
    let comments= [];
    it("Should return a new Comment(s) Array", function(done) {
      chai.request(app)
        .get("/api/comments")
        .end((error, response) => {
          if (error) return done(error);
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
    })
  })
})