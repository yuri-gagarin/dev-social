import passport from "passport";
import likesController from "../controllers/likesController.js";

export default function(router) {

  // @route POST /likes
  // @desc Adds a like to a post
  // @access Private
  router
    .route("/likes")
    .post(passport.authenticate("jwt", {session: false}), likesController.createLike);
  
  // @route DELETE /likes
  // @desc Deletes a like
  // @access Private
  router
    .route("/likes")
    .delete(passport.authenticate("jwt", {session: false}), likesController.removeLike);
}