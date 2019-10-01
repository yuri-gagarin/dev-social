import Post from "../models/Post.js";
import postValidator from "../helpers/validators/postValidator.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import getDateWithTime from "../helpers/getDateWithTime.js";
import makeRouteSlug from "./controller_helpers/makeRouteSlug.js";

//some indexting ideas for schema 
//Post.createdAt
//Port.likeCount?

//query opts constants
import {postSearchOptions} from "./controller_helpers/queryOptions.js";
import PostLike from "../models/PostLike.js";

const getTimeDifference = (option) => {
  const now = new Date();
  switch (option) {
    case(postSearchOptions.time.day):
      const lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 
                               now.getHours(), now.getMinutes(), now.getSeconds());
      return lastDay;
    case(postSearchOptions.time.week):
      const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7,
                                now.getHours(), now.getMinutes(), now.getSeconds());
      return lastWeek;
    case (postSearchOptions.time.month):
      const lastMonth = new Date(now.getFullYear(). now.getMonth() - 1, now.getDate(),
                                 now.getHours(), now.getMinutes(), now.getSeconds());
      return lastMonth;
    case (postSearchOptions.time.year):
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(),
                                now.getHours(), now.getMinutes(), now.getSeconds());
      return lastYear;
    default:
      return null;
  } 
};

/**
 * Creates a post query from Post navbar options.
 * @param {object} queryOptions - Options for the Mongo query.
 * @param {string} queryOptions.filter - A filter constant for the query (default - new).
 * @param {string} queryOptions.time - A time filter for the Post query (default - one day).
 * @returns {Array} An array with the mongo query (default returns sort by createdAt DESC).
*/
const makePostQuery = (queryOptions) => {
  const filter = queryOptions.filter ? queryOptions.filter : postSearchOptions.filter.new;
  const time = queryOptions.time ? queryOptions.time : postSearchOptions.time.day;
  const timeFilter = getTimeDifference(time);
  console.log(filter)
  console.log(typeof timeFilter)
  switch (filter) {
    case(postSearchOptions.filter.new):
      console.log("here")
      return [
        {createdAt: {$gt: timeFilter}}, {}, {sort: {createdAt: -1}, limit: 10 }
      ];
    case(postSearchOptions.filter.trending): 
      //probably should be amount of likes in a time period
      return [
        {createdAt: {$gt: timeFilter}}, {}, {sort: {createdAt: 1}, limit: 5} 
      ];
    case(postSearchOptions.filter.heated): 
      //probably should be most liked or commented in a time period
      return [
        {createdAt: {$gt: timeFilter}}, {}, {}
      ];
    case(postSearchOptions.filter.discussed): 
    return [

    ]
    default: {
      return [
        {}, {}, {sort: {createdAt: -1}, limit: 10}
      ]
    }
  }
};

const getHotPosts = (fromDate, toDate) => {
  //hot posts should be recent, well discussed and liked.  
  return Post.find({likeCount: {$gte: 10}, commentCount: {$gte: 5}}, {}, {sort: {createdAt: -1}, limit: 10});
}
const getDatedPosts = async (fromDate, toDate) => {
  //so here we should be able to pull new posts or posts between a specific date
  const now = Date.now();
  return Post.find({createdAt: {$gte: fromDate, $lte: toDate || new Date(now)}})
};
const getDisccussedPosts = (fromDate, toDate) => {
  return Post.find({createdAt: fromDate, commentCount: {$gte: 5}}, {}, {sort: {commentCount: -1}, limit: 10});
};
const getControversialPosts = (fromDate, toDate) => {
  const UPPER_RATIO = 1.5;
  const LOWER_RATIO = 0.5;
  const controversialPosts = [];
  //this should have a somewhat close ration between likes and dislikes.
  Post.find({fromDate: {$gte: fromDate}, toDate: {$lte: toDate}, limit: 50})
    .then((posts) => {
      for (const post of posts) {
        const likeRatio = post.likeCount / post.dislikeCount;
        if (likeRatio <= UPPER_RATIO && likeRatio >= LOWER_RATIO) {
          //mark post as controversial
          let controversialPost = {...post.toObject(), likeRatio: likeRatio};
          controversialPosts.push(controversialPost);
        }
      }
      return controversialPosts;
    })
  //should sort and return posts with top elements being closest to 1.0 most controversial
}

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
    console.log("Searching posts")
    const filter = req.query.filter;
    const time  = req.query.time;
    const limit = req.query.limit;
    Post.find(...makePostQuery({filter: filter, time: time}) )
      .then((posts) => {
        console.log(116)
        console.log(posts)
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