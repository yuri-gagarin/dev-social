import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import commentValidator from "../helpers/validators/commentValidator.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import { convertTimeQuery } from "../helpers/timeHelpers.js";
import { COMMENT_QUERY_OPTIONS } from "./controller_helpers/controllerConstants.js";

export default {

  // index (fetch comments) //
  index: (req, res) => {
    const { postId, from, toDate, filter, limit } = req.query;

    const fromDate = convertTimeQuery(from, COMMENT_QUERY_OPTIONS);
    const toDate = toDate || new Date();
    filter = normalizeFilter(filter) // needs to be defined //
    limit = setLimit(limit) // needs to be defined //

    const params = {
      postId: postId,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      limit: limit
    };

    executeCommentQuery(params) // needs to be defined //

  },

  createComment: (req, res) => {
    const userId = req.user._id;
    const postId = req.body.postId;
    let commentedPost;


    //build a comment
    let newComment = {
      post: postId,
      user: userId,
      text: req.body.text,
      name: req.body.name || "anonymous",
      avatar: req.body.avatar || null
    };

    let {errors, isValid} = commentValidator(newComment);
    //check if comment is valid
    if(!isValid) {
      return res.status(400).json({
        message: "Error in your comment",
        errors: errors.text
      });
    }
    //match comment to post
    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          commentedPost = post;
          return Comment.create(newComment);
        }
        else {
          return Promise.reject("Can't match Post to Comment");
        }
      })
      //push a comment to post, resolve promise
      .then((comment) => {
        commentedPost.comments.push(comment);
        commentedPost.commentCount += 1;
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
    const text = req.body.text;

    const {errors, isValid} = commentValidator(req.body);
    //validate input
    if(!isValid) {
      return res.status(400).json({
        message: "Error editing comment",
        errors: errors
      });
    }
    //find post to modify comment
    Comment.findOne({_id: commentId})
      .then((comment) => {
        if(comment) {
          comment.text = `EDITED: ${getDateWithTime()} 
                          ${text}`;
          return comment.save();
        }
        else {
          return Promise.reject("Seems no comment here");
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

    const commentId= req.params.id;
    const userId = req.user.id;
    let postId;

    Comment.findOne({_id: commentId})
    //find a comment
    //verify a comment belongs to the user
      .then((comment) => {
        if (comment) {
          postId = comment.post.toString();
          return Comment.deleteOne({_id: commentId});
        }
        else {
          return Promise.reject("Seems to be a problem finding the comment");
        }
      })
      .then((result) => {
        if (result.ok) {
          return Post.findOne({_id: postId})
        }
        else {
          return Promise.reject("Seems to be a problem deleting the comment...");
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
            post.commentCount -= 1;
            return post.save();
          }
          else {
            return Promise.reject("Seems no Post-Comment");
          }
        }
        else {
          return Promise.reject("Seems no post here");
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