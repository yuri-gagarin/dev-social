import passport from "passport";
import postDislikesController from "../controllers/postDislikesController";
export default function(router) {

  // @route POST /api/posts/dislike_post/:postId
  // @desc Adds a dislike to a Post
  // @access Private
  router
    .route("/api/posts/dislike_post/:postId")
    .post(passport.authenticate("jwt", {session: false}), postDislikesController.addPostDislike);
  
  // @route DELETE /api/posts/remove_dislike/:postId
  // @desc Removes a dislike from a Post
  // @access Private
  router
    .route("/api/posts/remove_dislike/:postId")
    .delete(passport.authenticate("jwt", {session: false}), postDislikesController.removePostDislike);
}