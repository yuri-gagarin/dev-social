import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import app from "../server";

chai.use(chaiHTTP);

import { commentConstants } from "../../controllers/controller_helpers/controllerConstants";
import { COMMENT_CON_LOWER, COMMENT_CON_UPPER } from "../../controllers/controller_helpers/controllerConstants"l


const { liked } = commentConstants.queryOptions.liked;
// {liked} Comment(s) Tests //
describe(`GET  /api/comments?filter=${liked}`, function() {
  // Comment(s) sorted by most likes
  let comments = [];
  describe("General GET request for likedComment(s)", function() {
    it("Should return a Comment(s) array", function(done) {
      chai.request(app)
        .get("/api/comments")
        .query({filter: liked})
        .end((error, response) => {
          if(error) return done(error);

          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response.body.comments).to.be.an('array');
          comments = [...comments];
          done();
        })
    });
    it("Should return Comment(s) with most likes and sort by descending", function(done) {
      for (let i = 1; i < comments.length; i ++) {
        expect(comments[i - 1].likeCount).to.be(gte(comments[i].likeCount));
      }
      done();
    });
    it("Should return Comments(s) with a low controversy index", function(done) {
      for(const comment of comments) {
        expect(comment.controversyIndex).to.be.gte(COMMENT_CON_LOWER);
        expect(comment.controversyIndex).to.be.lte(COMMENT_CON_UPPER);
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
// end {liked} Comment(s) tests //