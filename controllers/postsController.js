import Post from "../models/Post.js";
import postValidator from "../helpers/postValidator";
import User from "../models/User.js";


export default {
  newPosts: (req, res) => {
    Post.find({}).populate("comments")//.sort({date: "desc"}).limit(25)
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
            post: newPost
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
    const postId = req.params.postId;

    //console.log(req.params);

    Post.findByIdAndDelete(postId)
      .then((post) => {
        return res.json({
          message: "Successfully Deleted Post",
          post: post
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