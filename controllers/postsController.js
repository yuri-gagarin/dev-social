import Post from "../models/Post.js";
import postValidator from "../helpers/validators/postValidator.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import makeRouteSlug from "./controller_helpers/makeRouteSlug.js";

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
  index: (req, res) => {
    const queryOption = req.query.q;
    const limit = req.query.limit || 15;
    const queryParams = (queryOption) => {
      switch(queryOption) {
        case "all":
          return {
            date: "DESC",
          };
        case "new":
          return {
            date: "DESC",
          };
        case "popular":
          return {
            comments: "DESC",
          };
        default: 
          return {
            date: "DESC",
          };
      }
    }
    Post.find({}).sort(queryParams(queryOption)).limit(limit)
      .then((posts) => {
        return res.json({
          message: "Success",
          posts: posts,
        })
      })
      .catch((err) => {
        console.log(err);
      })
    
  },  

  viewBySlug: (req, res) => {
    Post.findOne({_id: req.params.id})
      .then((post) => {
        if(post) {
          return res.json({
            post: post
          });
        }
        else {
          return res.status(404).json({
            message: "Seems no post found"
          });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          message: "An error occured",
          error: error.message
        });
      });
  },

  createPost: (req, res) => {
    const {errors, isValid} = postValidator(req.body);
    const author = `${req.user.name} ${req.user.lastName}`;
    if (isValid) {
      const newPost = new Post({
        author: author,
        title: req.body.title,
        text: req.body.text,
        avatar: req.body.avatar,
        user: req.user.id,
        slug: makeRouteSlug(req.body.title),
        likeCount: 0,
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

  editPost: (req, res) => {
    const postId = req.params.id;
    const user = req.user;

    const postText = req.body.text;
    if (!postText) {
      return res.status(400).json({
        message: "You should probably put in some text"
      });
    }
    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          post.editedAt = Date.now();
          post.text = `EDITED: ${getDateWithTime({format: "dateAndHour"})}
                       BY: ${user.name || "anonymous"}
                       ${postText}
                      `;
          return post.save();
        }
        else {
          return Promise.reject(new Error("No post found"));
        }
      })
      .then((post) => {
        return res.json({
          message: "Post successfully edited",
          post: post
        });
      })
      .catch((error) => {
        return res.status(400).json({
          message: "Something went wrong",
          error: error.message
        });
      });
  },

  deletePost: (req, res) => {

    // add some moderator functionality later
    const userId = req.user._id;
    const postId = req.params.id;


    Post.findOneAndDelete({_id: postId})
      .then((post) => {
        if (post) {
          return Comment.deleteMany({post: postId});
        }
        else {
          return Promise.reject(new Error("Seems no post found..."))
        }
      })
      .then((result) => {
        return res.json({
          message: `deleted post and ${result.deletedCount} post comments`
        });
      })
      .catch((error) => {
        return res.status(400).json({
          message: "Error deleting Post",
          errors: error.message
        });
      });
  }
}