import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import { cpus } from "os";

export default {

  createComment: (req, res) => {

    const userId = req.user._id;
    const postId = req.body.postId;
    let comm;
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
        comm = comment;
        return Post.findOne({_id: postId});
      })
      .then((post) => {
        post.comments.push(comm);
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
    const {postId, commentId} = req.query;
    //find post to modify comment
    Post.findOne({_id: postId})
      .then((post) => {
        return new Promise((resolve, reject) => {
          if(post) {
            let commentIindex = post.comments.findIndex((comment) => {
              return comment._id.equals(commentId);
            });
            //ensure the user is the owner of the comment
            //if correct user append an edit date
            if (post.comments[commentIindex].user.equals(userId)) {
              post.comments[commentIindex].text = `EDITED: ${getDateWithTime()} \n ${req.body.text}`;
              resolve(post.save());
            }
            else {
              reject("Not authorized to modify the comment");
            }
          }
          else {
            reject("Invalid Request");
          }
        });
      })
      .then((post) => {
        return res.json({
          message: "Comment edited",
          post: post
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error processing request",
          errors: err
        })
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