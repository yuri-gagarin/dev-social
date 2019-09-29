import {FETCH_POSTS,FETCH_TRENDING_POSTS, LIKE_POST, UNLIKE_POST, LIST_ERRORS} from "../cases.js";
import {trimString} from "../../helpers/rendering/displayHelpers.js";
import axios from "axios";

import {postSearchOptions} from "../searchOptions.js";

export const fetchPosts = (options={}) => {
  console.log(options)
  const filter = options.filter || postSearchOptions.filter.new;
  const time = options.time || postSearchOptions.time.day;
  const limit = options.fetchLimit || 10;
  return function(dispatch) {
    axios({
      method: "get",
      url: `/api/posts`,
      params: {
        filter: filter,
        time: time,
        limit: limit,
      }
    })
    .then((response) => {
      const posts = response.data.posts.map((post) => {
        return {...post, text: trimString(post.text, 100)};
      });
      const postState = {
        message: response.data.message,
        posts: posts,
      };
      dispatch({
        type: FETCH_POSTS,
        payload: postState,
      });
    })
    .catch((error) => {
      dispatch({
        type: LIST_ERRORS,
        payload: error,
      })
    });
  }
};

export const fetchTrendingPosts = () => {
  return function(dispatch) {
    axios({
      method: "get",
      url: `/api/posts?q=trending&l=5`,
    })
    .then((response) => {
      const trendingPosts = response.data.posts.map((post) => {
        return {
          _id: post._id,
          title: post.title,
          author: post.author,
          likeCount: post.likeCount,
        };
      });
      const trendingPostsState = {
        message: response.data.message,
        trendingPosts: trendingPosts,
      };
      dispatch({
        type: FETCH_TRENDING_POSTS,
        payload: trendingPostsState,
      });
    })
    .catch((error) => {
      dispatch({
        type: LIST_ERRORS,
        payload: error
      });
    });
  }
};

export const likePost = (postId, userId) => {
  return function(dispatch) {
    
    ///api actions

    dispatch({
      type: LIKE_POST,
      payload: 0,
    })
  };
};

export const unlikePost = (postId, userId) => {
  return function(dispatch) {
    //api actions
    dispatch({
      type: UNLIKE_POST,
      payload: 0,
    });
  };
};


//downvotes later??
export const downvotePost = (postdId, userId) => {

};
export const removeDownvote = (postId, userId) => {

};
