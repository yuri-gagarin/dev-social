import Comment from "../models/Comment.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";

export default {
  createLike: (req, res) => {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const userId = req.user._id;

    Comment.findOne({_id: commentId})
      .then((comment) => {
        if (comment) {
          for (let i = 0; i < comment.likes.length; i++) {
            if (comment.likes[i].user.equals(userId)) {
              return rejectionPromise("Already Liked!");
            }
          }
          comment.likes.push({user: userId});
          return comment.save();
        }
        else {
          return rejectionPromise("No comment found");
        }
      })
      .then((comment) => {
        return res.json({
          message: "Liked Comment",
          comment: comment
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
  },
  deleteLike: (req, res) => {
    const commentId = req.body.commentId;
    const userId = req.user._id;
    console.log("comment \n" + commentId)

    Comment.findOne({_id: commentId})
      .then((comment) => {
        console.log(comment);
        if(comment) {
          console.log("comment here");

          let deleteIndex;
          let likesLength = comment.likes.length;

          for (let i = 0; i < likesLength; i++) {

            if (comment.likes[i].user.equals(userId)) {
              deleteIndex = i;
              break;
            }
          }

          if (deleteIndex) {
            comment.likes.splice(deleteIndex, 1);
            return comment.save();
          }
          else {
            return rejectionPromise("No Like");
          }
        }
        else {
          return rejectionPromise("No Comment Found");
        }
      })
      .then((comment) => {
        return res.json({
          message: "Unliked a comment",
          comment: comment
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });

  } 
}