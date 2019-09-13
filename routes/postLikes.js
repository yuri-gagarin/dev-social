import passport from "passport";
import postLikesController from "../controllers/postLikesController.js";

export default function(router) {

  // @route POST /posts/like_post
  // @desc Adds a like to a post
  // @access Private
  router
    .route("/api/posts/like_post/:postId")
    .post(passport.authenticate("jwt", {session: false}), postLikesController.createLike);
  
  // @route DELETE /posts/unlike_post
  // @desc Deletes a like
  // @access Private
  router
    .route("/api/posts/unlike_post/:postId")
    .delete(passport.authenticate("jwt", {session: false}), postLikesController.removeLike);
}