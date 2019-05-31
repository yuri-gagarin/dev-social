import passport from "passport";
import commentLikesController from "../controllers/commentLikesController.js";

export default function(router) {
  
  // @route POST /like_comment
  // @desc Creates a comment like
  // @access Private
  router
    .route("/comments/like_comment")
    .post(passport.authenticate("jwt", {session: false}),commentLikesController.createLike);
  
  // @route DELETE /unlike_comment
  // @desc Deletes a comment like
  // @access Private
  router
    .route("/comments/unlike_comment")
    .delete(passport.authenticate("jwt", {session: false}),commentLikesController.deleteLike);
};