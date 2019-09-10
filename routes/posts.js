import passport from "passport";
import postsController from "../controllers/postsController.js";
import accessController from "../controllers/access_control/accessController.js";

export default function(router) {

  // @route GET /posts
  // @desc Gets post
  // @access Public
  router
    .route("/api/posts")
    .get(postsController.index);
  
  // @route GET /posts/newest
  // @desc Gets newest posts
  // @access Public
  router
    .route("/api/posts/newest")
    .get(postsController.newPosts);
  
  // @route GET /posts/:slug
  // @desc Gets a post by its slug
  // @access Public
  router  
    .route("/api/posts/:id/:slug")
    .get(postsController.viewBySlug);

  // @route POST /posts
  // @desc Create a post
  // @access Private
  router
    .route("/api/posts")
    .post([passport.authenticate("jwt", {session: false}), accessController("post", "create_post")], postsController.createPost);
  
  // @route PATCH  /posts/:id
  // @desc Edits a post
  // @access Private
  router
    .route("/api/posts/:id")
    .patch([passport.authenticate("jwt", {session: false}), accessController("post", "edit_post")], postsController.editPost);
  
  // @route DELETE /posts/:id
  // @desc Deletes a post
  // @access Private
  router
    .route("/api/posts/:id")
    .delete([passport.authenticate("jwt", {session: false}), accessController( "post", "delete_post")], postsController.deletePost);
};