import Post from "../models/Post.js";
import postValidator from "../helpers/postValidator.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";
import RBAC from "./access_control/RBAC.js";

export default {
  newPosts: (req, res) => {

    let commentOptions = {
      path: "comments",
      options: {
        limit: 5,
        sort: {date: "desc"}
      }
    }
    Post.find({}).populate(commentOptions).sort({date: "desc"}).limit(25)
      .then((posts) => {
        return res.json({
          message: "Newest Posts",
          posts: posts
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error retrieving the posts",
          errors: err
        });
      });
  },

  createPost: (req, res) => {

    const {errors, isValid} = postValidator(req.body);

    if (isValid) {
      const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      });

      newPost.save()
        .then((post) => {
          return res.json({
            message: "New Post!",
            post: post
          });
        })
        .catch((err) => {
          return res.status(400).json({
            message: "Error in saving a new Post",
            errors: err
          });
        });
    }
    else {
      return res.status(400).json({
        message: "Error processing your request",
        errors: errors
      });
    }
  },

  deletePost: (req, res) => {

    // add some moderator functionality later
    const userId = req.user._id;
    const postId = req.params.id;


    Post.findByIdAndDelete(postId)
      .then((post) => {
        if (post) {
          return Comment.deleteMany({post: postId});
        }
        else {
          return rejectionPromise("No Post found");
        }
      })
      .then((result) => {
        console.log(result);
        return res.json({
          message: `deleted post and ${result.deletedCount} post comments`
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error deleting Post",
          errors: err
        });
      });
  }
}