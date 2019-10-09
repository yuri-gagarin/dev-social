import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import seedDB from "./seeds/seedDB.js";
chai.use(chaiHttp);


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
});
