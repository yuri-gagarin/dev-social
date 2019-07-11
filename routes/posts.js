import passport from "passport";
import postsController from "../controllers/postsController.js";
import accessController from "../controllers/access_control/accessController.js";

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
  
  // @route PATCH  /posts/:id
  // @desc Edits a post
  // @access Private
  router
    .route("/posts/:id")
    .patch([passport.authenticate("jwt", {session: false}), accessController("post", "edit_post")], postsController.editPost);
  
  // @route DELETE /posts/:id
  // @desc Deletes a post
  // @access Private
  router
    .route("/posts/:id")
    .delete([passport.authenticate("jwt", {session: false}), accessController( "post", "delete_post")], postsController.deletePost);
};