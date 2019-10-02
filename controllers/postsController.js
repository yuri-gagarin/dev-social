import Post from "../models/Post.js";
import postValidator from "../helpers/validators/postValidator.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import makeRouteSlug from "./controller_helpers/makeRouteSlug.js";

import {convertTimeQuery} from "../helpers/timeHelpers.js";
import {postSearchOptions} from "../helpers/constants/queryOptions.js";
//some indexting ideas for schema 
//Post.createdAt
//Port.likeCount?

//query opts constants
import {postSearchOptions} from "./controller_helpers/queryOptions.js";
import PostLike from "../models/PostLike.js";

const getHotPosts = (fromDate, toDate) => {
  //hot posts should be recent, well discussed and liked.  
  return Post.find(
    {likeCount: {$gte: 10}, commentCount: {$gte: 5}}, 
    {}, 
    {sort: {createdAt: -1}, limit: 10}
  );
}
const getDatedPosts = (fromDate, toDate, limit) => {
  //so here we should be able to pull new posts or posts between a specific date
  const now = new Date();
  return Post.find(
    {createdAt: {$gte: fromDate, $lte: toDate || now}}, 
    {}, 
    {sort: {createdAt: -1}},
  );
};
const getDisccussedPosts = (fromDate, toDate, limit=10) => {
  return Post.find(
    {createdAt: fromDate, commentCount: {$gte: 5}}, 
    {}, 
    {sort: {commentCount: -1}, limit: limit}
  );
};
const getHeatedPosts = (fromDate, toDate) => {
  const UPPER_LIMIT = 65;
  const LOWER_LIMIT = 35;
  const heatedPosts = [];
  //this should have a somewhat close ration between likes and dislikes.
  Post.find({fromDate: {$gte: fromDate}, toDate: {$lte: toDate}, limit: 50})
    .then((posts) => {
      for (const post of posts) {
        const likePercentage = (likeCount / (post.likeCount + post.dislikeCount)) * 100;
        if (likePercentage <= UPPER_LIMIT && likePercentage >= LOWER_LIMIT) {
          //mark post as heated
          //controversy index, the closer to 0 the more even spread between likes and dislikes
          let heatIndex = Math.abs(likePercentage - 50);
          let heatedPost = {...post.toObject(), heatIndex: heatIndex};
          heatedPosts.push(heatedPost);
        }
      }
      //sort the heated Post(s) based on controversyIndex
      heatedPosts.sort((a, b) => {
        return a - b;
      })
      return heatedPosts;
    })
  //should sort and return posts with top elements being closest to 1.0 most heated
}

/**
 * Creates a post query from Post navbar options.
 * @param {object} queryOptions - Options for the Mongo query.
 * @param {string} queryOptions.filter - A filter constant for the query (default - new).
 * @param {string} queryOptions.time - A time filter for the Post query (default - one day).
 * @returns {Array} An array with the mongo query (default returns sort by createdAt DESC).
*/
const executePostQuery = (queryOptions, postSearchOptions) => {
  //some type checking
  
  const timeFilter = getTimeDifference(time);
  switch (queryOptions.filter) {
    case(postSearchOptions.filter.new):
      return getDatedPosts(queryOptions.fromDate, queryOptions.toDate, queryOptions.t)
    case(postSearchOptions.filter.trending): 
      //probably should be amount of likes in a time period
      return getHotPosts()
    case(postSearchOptions.filter.heated): 
      //probably should be most liked or commented in a time period
      return getHeatedPosts()
    case(postSearchOptions.filter.discussed): 
      return getDisccussedPosts()
    default: {
      return 
    }
  }
};



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
    const filter = req.query.filter || postSearchOptions.filter.new;
    const time  = req.query.time || postSearchOptions.time.day;
    const limit = req.query.limit || 10;
    const toDate = req.query.toDate || new Date();
    //normalize parameters for a query. Maybe I will do most of this on the front end dont know yet...
    //first convert the time parameter passed in into a valid Date object
    const fromDate = convertTimeQuery(time, postSearchOptions)
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