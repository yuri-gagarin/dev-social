import passport from "passport";
import commentsController from "../controllers/commentsController";

export default function(router) {
  router
    .route("/comments")
    .get((req, res) => {
      res.json({
        message: "Comments works"
      });
    });
  
  // @route POST /comments
  // @desc Creates a new comment
  // @access Private
  router 
    .route("/comments")
    .post(passport.authenticate("jwt", {session: false}), commentsController.createComment);
  
  // @route DELETE /comments
  // @desc Deletes a comment
  // @access Private
  router  
    .route("/comments")
    .delete(passport.authenticate("jwt", {session: false}),
    commentsController.deleteComment);
};