import Comment from "../models/Comment.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";

export default {
  createLike: (req, res) => {
    const commentId = req.query.commentId;
    const userId = req.user._id;

    Comment.findOne({_id: commentId})
      .then((comment) => {
        if (comment) {
          //check if comment already liked reject if liked
          let likesLength = comment.likes.length;
          for (let i = 0; i < likesLength; i++) {
            if (comment.likes[i].user.equals(userId)) {
              return rejectionPromise("Already Liked!");
            }
          }
          comment.likes.push({user: userId});
          return comment.save();
        }
        //in case no comment
        else {
          return rejectionPromise("No comment found");
        }
      })
      .then((comment) => {
        return res.json({
          message: "Liked Comment",
          likeCount: comment.likes.length
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
    const commentId = req.query.commentId;
    const userId = req.user._id;

    Comment.findOne({_id: commentId})
      .then((comment) => {
        if(comment) {

          let deleteIndex = -1;
          let likesLength = comment.likes.length;
          //loop through likes break out early if like found
          for (let i = 0; i < likesLength; i++) {
            if (comment.likes[i].user.equals(userId)) {
              deleteIndex = i;
              break;
            }
          }
          //check for valid delete index
          if (deleteIndex > -1) {
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
          likeCount: comment.likes.length
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