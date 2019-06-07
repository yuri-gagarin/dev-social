import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";

export default {

  createComment: (req, res) => {
    const userId = req.user._id;
    const postId = req.query.postId;
    let commentedPost;

    //build a comment
    let newComment = {
      post: postId,
      user: userId,
      text: req.body.text,
      name: req.body.name || "anonymous",
      avatar: req.body.avatar || null
    };
    //push a comment to post, resolve promise
    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          commentedPost = post;
          return Comment.create(newComment);
        }
        else {
          return rejectionPromise("Cant match post to comment");
        }
      })
      //match comment to post
      .then((comment) => {
        commentedPost.comments.push(comment);
        return commentedPost.save();
      })
      .then((post) => {
        return res.json({
          message: "Comment added",
          postCommentCount: post.comments.length,
          post: post
        })
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
          //verify user
          //add moderator functionality
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

    const commentId= req.query.commentId;
    const userId = req.user.id;
    let postId;

    Comment.findOne({_id: commentId})
    //find a comment
    //verify a comment belongs to the user
      .then((comment) => {
        if (comment) {
          postId = comment.post.toString();
          if (comment.user.equals(userId)) {
            return Comment.deleteOne({_id: commentId});
          }
          else {
            return rejectionPromise("Not authorized to delete the comment");
          }
        }
        else {
          return rejectionPromise("Seems to be a problem finding the comment");
        }
      })
      .then((result) => {
        if (result.ok) {
          return Post.findOne({_id: postId})
        }
        else {
          return rejectionPromise("Seems to be a problem deleting the comment...");
        }
      })
      .then((post) => {
        //find comment to remove
        if (post) {
          let postComments = post.comments.length;
          let deleteIndex = -1;
          //find the index of the comment
          //remove the comment from post.comments array
          for (let i = 0; i < postComments; i++) {
            if (post.comments[i].equals(commentId)) {
              deleteIndex = i;
              break;
            }
          }
          //verify the delete index 
          if (deleteIndex > -1) {
            post.comments.splice(deleteIndex, 1);
            return post.save();
          }
          else {
            return rejectionPromise("Seems no Post-Comment");
          }
        }
        else {
          return rejectionPromise("Seems no post here");
        }
      })
      .then((post) => {
        return res.json({
          message: `Deleted comment`,
          post: post
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        })
      })
      
  }
 
};