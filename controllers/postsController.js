import Post from "../models/Post.js";
import postValidator from "../helpers/validators/postValidator.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import makeRouteSlug from "./controller_helpers/makeRouteSlug.js";

import {rewind} from "../helpers/timeHelpers.js";


//some indexting ideas for schema 
//Post.createdAt
//Port.likeCount?

//query opts constants
import {postSearchOptions} from "./controller_helpers/queryOptions.js";

import {executePostQuery} from "./controller_helpers/postQueryHelpers.js";


export default {
  search: (req, res) => {
    console.log("calling")
    const pattern = req.query.pattern;
    const regex = new RegExp(pattern, "i");
    Post.find({title: {$regex: regex} }).limit(5)
      .then((results) => {
        if(results.length > 0) {
          const searchResults = results.map((post) => {
            return {
              _id: post._id,
              key: post._id,
              title: post.title,
              author: post.author,
            }
          });
          return res.status(200).json({
            message: "Found Posts",
            searchResults: searchResults,
          });
        }
        else {
          return res.status(200).json({
            message: "No posts found",
            searchResults: [],
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(400).json({
          message: "error",
        });
      });
  },
  index: (req, res) => {
    let {fromDate, toDate, filter, limit} = req.query
    //check for null required values
    //maybe remove to a separate function
    if (!fromDate) {
      fromDate = rewind.goBackOneMonth();
    }
    else {
      fromDate = new Date(fromDate);
    }
    if (filter && typeof filter === 'string') {
      filter = filter.toLowerCase();
    } 
    else {
      filter = postSearchOptions.filter.new;
    }
    if (limit) {
      limit = parseInt(limit, 10);
    }
    else {
      limit = 10;
    }
    //normalize parameters for a query. Maybe I will do most of this on the front end dont know yet...
    //first convert the time parameter passed in into a valid Date object
    const params = {
      filter: filter,
      toDate: toDate,
      fromDate: fromDate,
      limit: limit,
    };
    //execute the post query based on either default params or params passed down from Post toolbar
    executePostQuery(params, postSearchOptions)
      .then((posts) => {
        return res.status(200).json({
          message: "Loaded posts",
          posts: posts,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          message: "An error occured",
        });
      });    
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

    Post.findOne({_id: postId})
      .then((post) => {
        const postText = req.body.text ? req.body.text : post.text;
        const postTitle = req.body.title ? req.body.title : post.title;
        if(post) {
          post.title = postTitle
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