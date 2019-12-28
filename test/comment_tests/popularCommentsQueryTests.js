import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import app from "../server";

chai.use(chaiHTTP);

import { commentConstants } from "../../controllers/controller_helpers/controllerConstants";

const { POP_COMMENT_LIKE_MIN, POP_COMMENT_LIKE_RATIO } = commentConstants.constraints;

// {popular} Comment(s) Tests //
describe("GET {popular} Comment(s)", function() {
  // Comment(s) where there are at least a certain number of likes, comments and a positive like ratio
  let comments = [];
  describe("General GET request for popular Comment(s)", function() {
    it("Should return a Comment(s) array", function(done) {
      chai.request(app)
        .get("/api/comments")
        .query({filter: "popular"})
        .end((error, response) => {
          if(error) return done(error);

          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response.body.comments).to.be.an('array');
          comments = [...comments];
          done();
        })
    });
    it("Should return Comment(s) with a positive like ratio", function(done) {
      for (const comment of comments) {
        expect(comment.likeCount / comment.dislikeCount).to.be.gte(POP_COMMENT_LIKE_RATIO);
      }
      done();
    });
    it("Should return Comment(s) with a minimum amount of Likes", function(done) {
      for(const comment of comments) {
        expect(comment.likeCount).to.be.gte(POP_COMMENT_LIKE_MIN);
      }
      done();
    });
    it("Should return Comments(s) with a low controversy index", function(done) {
      for(const comment of comments) {
        expect(comment.controversyIndex).to.be.gte(COMMENT_CON_LOWER);
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
// end {popular} Comment(s) tests //