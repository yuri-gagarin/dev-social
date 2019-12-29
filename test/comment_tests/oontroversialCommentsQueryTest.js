import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import app from "../server";

chai.use(chaiHTTP);

import { commentConstants } from "../../controllers/controller_helpers/controllerConstants";

const { CONT_COMMENT_LIKE_MIN, CONT_COMMENT_DISLKIKE_MIN } = commentConstants.constraints;
const { controversial } = commentConstants.queryOptions.filter;

// {controversial} Comment(s) Tests //
describe("GET {controversial} Comment(s)", function() {
  // Comments which fit within the {Comment.controversyIndex} //
  let comments = [];
  describe("General GET request for controversial Comment(s)", function() {
    it("Should return a Comment(s) array", function(done) {
      chai.request(app)
        .get("/api/comments")
        .query({filter: controversial})
        .end((error, response) => {
          if(error) return done(error);

          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response.body.comments).to.be.an('array');
          comments = [...comments];
          done();
        })
    });
    it("Should return Comment(s) within a {Comment.controversyIndex}", function(done) {
      for (const comment of comments) {
        expect(comment.controversyIndex).to.be.lte(COMMENT_CON_UPPER);
        expect(comment.controversyIndex).to.be.gte(COMMENT_CON_LOWER);
      }
      done();
    });
    it("Should return Comment(s) with a minimum amount of Likes", function(done) {
      for(const comment of comments) {
        expect(comment.likeCount).to.be.gte(CONT_COMMENT_LIKE_MIN);
      }
      done();
    });
    it("Should return Comment(s) with a minimum amount of Dislikes", function(done) {
      for(const comment of comments) {
        expect(comment.dislikeCount).to.be.gte(CONT_COMMENT_DISLKIKE_MIN);
      }
      done();
    });
    //Comment(s) should be newer
    it("Should return Comment(s) after a certain date", function(done) {
      const MIN_DATE = rewind.goBackOneWeek();
      for(const comment of comments) {
        expect(new Date(comment.createdAt)).to.be.gte(MIN_DATE);
      }
      done();
    });
  });
});
// end {controversial} Comment(s) tests //