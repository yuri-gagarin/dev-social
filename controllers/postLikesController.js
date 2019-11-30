import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import PostDislike from "../models/PostDislike.js";

import {calcControversy} from "./controller_helpers/likeHelpers";


export default {
  createLike: (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    let editedPost, responseCode;

    Post.findOne({_id: postId})
      .then((post) => {
        //check for a valid post
        if(post) {
          //check for existing dislike
          editedPost = post;
          return PostDislike.deleteOne({postId: postId, userId: userId})
        }
        else {
          responseCode = 404;
          Promise.reject(new Error("Can't seem to find the Post"));
        }
      })
      .then((response) => { 
        //found and deleted
        if(response.ok && response.deletedCount === 1) {
          editedPost.dislikeCount -= 1;
          return Promise.resolve(editedPost);
        }
        //not found but no delete error
        else if(response.ok && response.deletedCount === 0) {
          return Promise.resolve(editedPost);
        }  
        //some sort of error 
        else {
          responseCode = 500;
          return Promise.reject(new Error("Something went wrong on our end"));
        }
      })
      .then((post) => {
        //check for an existing PostLike
        return PostLike.findOne({postId: post._id, userId: userId});
      })
      .then((postLike) => {
        if(postLike) {
          responseCode = 400;
          return Promise.reject(new Error("Already liked this Post"));
        }
        else {
          return PostLike.create({postId: editedPost._id, userId: userId});
        }
      })
      .then((postLike) => {
        editedPost.likeCount += 1;
        // set new controversy index
        editedPost.controversyIndex = calcControversy({likeCount: editedPost.likeCount, dislikeCount: editedPost.dislikeCount});
        return editedPost.save();
      })
      .then((post) => {
        return res.status(200).json({
          message: "Liked Post",
          updatedPost: {
            _id: post._id,
            likeCount: post.likeCount,
            dislikeCount: post.dislikeCount,
          }
        });
      })
      .catch((error) => {
        return res.status(responseCode || 500).json({
          message: "An error occured",
          error: error,
          errorMessage: error.message,
        });
      });
  },

  removeLike: (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    let editedPost, responseCode;

    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          editedPost = post;
          return PostLike.deleteOne({postId: postId, userId: userId});
        }
        else {
          //no Post or wrong user input
          responseCode = 404;
          return Promise.reject(new Error("Seems we can't find that Post"));
        }
      })
      .then((response) => {
        if(response.ok && response.deletedCount === 1) {
          //deleted a PostLike
          editedPost.likeCount -= 1;
          editedPost.controversyIndex = calcControversy({likeCount: editedPost.likeCount, 
                                                         dislikeCount: editedPost.dislikeCount});
          return editedPost.save();
        }
        else if (response.ok && response.deletedCount === 0) {
          //no PostLike to remove
          responseCode = 400;
          return Promise.reject(new Error("You didn't like this Post"));
        }
        else {
          //semothing went wrong?
          responseCode = 500;
          return Promise.reject(new Error("Something went wrong on our end"));
        }
      })
      .then((post) => {
        return res.status(200).json({
          message: "Unliked the Post",
          updatedPost: {
            _id: post._id,
            likeCount: post.likeCount,
            dislikeCount: post.dislikeCount
          }
        })
      })
      .catch((error) => {
        return res.status(responseCode || 500).json({
          message: "An error occured",
          error: error,
          errorMessage: error.message,
        });
      });
  }
};