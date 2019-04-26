import passport from "passport";
import postsController from "../controllers/postsController.js";

export default function(router) {

  // @route GET /posts/newest
  // @desc Gets newest posts
  // @access Public
  router
    .route("/posts/newest")
    .get(postsController.newPosts);

  // @route POST /posts
  // @desc Create a post
  // @access Private
  router
    .route("/posts")
    .post(passport.authenticate("jwt", {session: false}), postsController.createPost);
  
  // @route DELETE /posts
  // @desc Deletes a post
  // @access Private
  router
    .route("/posts/:postId")
    .delete(passport.authenticate("jwt", {session: false}), postsController.deletePost);
};