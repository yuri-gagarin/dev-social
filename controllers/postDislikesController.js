import PostDislike from "../models/PostDislike.js";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import { calcControversy } from "./controller_helpers/likeHelpers.js";


export default {
  addPostDislike: (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    let editedPost;
    let responseCode;
    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          //check if user liked a Post
          //if liked remove Like and add a Dislike
          editedPost = post;
          return PostLike.deleteOne({postId: postId, userId: userId});
        }
        else {
          responseCode = 404;
          return Promise.reject(new Error("Can't seem to find the Post"));
        }
      })
      .then((response) => {
        //found and deleted
        if(response.ok && response.deletedCount === 1) {
          editedPost.likeCount -= 1;
          return Promise.resolve(editedPost);
        }
        //not found but no delete error
        else if(response.ok && response.deletedCount === 0) {
          return Promise.resolve(editedPost);
        }
        //some sort of error
        else {
          responseCode = 500;
          return Promise.reject("Uh Oh. Something is wrong on our end");
        }
      })
      .then((post) => {
        //check for an already present PostDislike
        return PostDislike.findOne({postId: post._id, userId: userId});
      })
      .then((postDislike) => {
        //user already disliked the post 
        if (postDislike) {
          responseCode = 400;
          return Promise.reject(new Error("Already disliked the Post"));
        }
        else {
          return PostDislike.create({postId: postId, userId: userId});
        }
      })
      .then((newDislike) => {
        editedPost.dislikeCount += 1;
        editedPost.controversyIndex = calcControversy({likeCount: editedPost.likeCount, dislikeCount: editedPost.dislikeCount});
        return editedPost.save()
      })
      .then((post) => {
        responseCode = 200;
        return res.status(responseCode).json({
          message: "Disliked the Post",
          post: {
            id: post._id,
            likeCount: post.likeCount,
            dislikeCount: post.dislikeCount,
          }
        });
      })
      .catch((error) => {
        return res.status(responseCode||500).json({
          message: "Seems something went wrong",
          error: error,
          errorMessage: error.message,
        })
      });
  },
  removePostDislike: (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    let editedPost, responseCode;
    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          editedPost = post;
          return PostDislike.deleteOne({postId: postId, userId: userId})
        }
        else {
          //no post or wrong user input?
          responseCode = 404;
          return Promise.reject(new Error("Seems we can't find that Post"));
        }
      })
      .then((response) => {
        if(response.ok && response.deletedCount === 1) {
          editedPost.dislikeCount -= 1;
          editedPost.controversyIndex = calcControversy({likeCount: editedPost.likeCount, 
                                                         dislikeCount: editedPost.dislikeCount});
          return editedPost.save();
        }
        else if(response.ok && response.deletedCount === 0) {
          //no PostDislike to delete
          responseCode = 400;
          return Promise.reject(new Error("No dislike to remove"));
        }
        else {
          //something wrong on the server
          responseCode = 500;
          Promise.reject(new Error("Seems like somthing went wrong on our end"));
        }
      })
      .then((post) => {
        responseCode = 200;
        return res.status(200).json({
          message: "Removed the dislike",
          post: post,
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
};
