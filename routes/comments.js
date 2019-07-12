import passport from "passport";
import commentsController from "../controllers/commentsController";
import accessController from "../controllers/access_control/accessController.js";

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
    .post([passport.authenticate("jwt", {session: false}), accessController("comment", "create_comment")], commentsController.createComment);

  // @route PATCH /comments/:id
  // @desc Modifies a comment
  // @access Private
  router
    .route("/comments/:id")
    .patch([passport.authenticate("jwt", {session: false}), accessController("comment", "edit_comment")],commentsController.modifyComment);
  
  // @route DELETE /comments/:id
  // @desc Deletes a comment
  // @access Private
  router  
    .route("/comments/:id")
    .delete([passport.authenticate("jwt", {session: false}), accessController("comment", "delete_comment")],
    commentsController.deleteComment);
};