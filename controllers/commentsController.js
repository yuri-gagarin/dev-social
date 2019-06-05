import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";
import { cpus } from "os";

export default {

  createComment: (req, res) => {

    const userId = req.user._id;
    const postId = req.body.postId;
    let createdComment;
    console.log(req.body)
    let newComment = {
      post: postId,
      user: userId,
      text: req.body.text,
      name: req.body.name || "anonymous",
      avatar: req.body.avatar || undefined
    };
    //push a comment to post, resolve promise
    Comment.create(newComment)
      .then((comment) => {
        createdComment = comment;
        return Post.findOne({_id: postId});
      })
      //push a comment to Post.comments
      .then((post) => {
        post.comments.push(createdComment);
        return post.save();
      })
      .then((post) => {
        return res.json({
          message: "Comment added",
          post: post
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
  },

  modifyComment: (req, res) => {

    const userId = req.user._id;
    const {postId, commentId, text} = req.body
    //find post to modify comment
    Comment.findOne({_id: commentId})
      .then((comment) => {
        if(comment) {
          console.log(comment);
          console.log(userId);
          if (comment.user.equals(userId)) {
            comment.text = `EDITED: ${getDateWithTime()} 
                            ${text}`;
            return comment.save();
          }
          else {
            return rejectionPromise("Not authorized to edit comment");
          }
        }
        else {
          return rejectionPromise("Seems no comment here");
        }
      })
      .then((comment) => {
        return res.json({
          message: "Edited a comment",
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

  deleteComment: (req, res) => {

    const userId = req.user._id;
    const postId = req.query.postId;
    const commentId = req.query.commentId;

    //find post
    Post.findOne({_id: postId})
      .then((post) => {
        return new Promise((resolve, reject) => {
          //deal with the post if found
          //find specific comment and it's index
          if(post) {
            let comment = post.comments.find((comment) => {
              return comment._id.equals(commentId);
            });
            let commentIindex = post.comments.findIndex((comment) => {
              return comment._id.equals(commentId);
            });
            //check if it is user's comment to delete
            //add admin privilege later
            if (comment.user.equals(userId)) {
              post.comments.splice(commentIindex, 1);
              resolve(post.save());
            }
            else {
              reject("Not authorized to delete the comment");
            }
          }
          else {
            //reject if no post
            reject("No post found");
          }
        });
      })
      .then((post) => {
        //assuming success return updated post
        return res.json({
          message: "Comment succesfully removed",
          post: post
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occurred",
          errors: err
        });
      });
  }
 
}