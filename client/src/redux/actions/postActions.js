import {FETCH_TRENDING_POSTS, LIKE_POST, UNLIKE_POST, LIST_ERRORS, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR} from "../cases.js";
import {trimString} from "../../helpers/rendering/displayHelpers.js";
import axios from "axios";
import {postSearchOptions} from "../searchOptions.js";


export const postsRequest = () => {
  return {
    type: POSTS_REQUEST,
    payload: {
      loading: true,
    }
  };
};
export const postsSuccess = (data) => {
  return {
    type: POSTS_SUCCESS,
    payload: {
      message: data.message,
      posts: data.posts,
      loading: false,
    }
  };
};
export const postsError = (error) => {
  return {
    type: POSTS_ERROR,
    payload: {
      message: error.message,
      loading: false,
      error: error,
    }
  };
};

export const fetchPosts = (options={}) => {
  const params = {
    from: options.from || null,
    toDate: options.toDate || null,
    filter: options.filter || postSearchOptions.filter.new,
    limit: options.limit || 10,
  };

  return function(dispatch) {
    dispatch(postsRequest());
    return axios({
      method: "get",
      url: `/api/posts`,
      params: {...params},
    })
    .then((response) => {
      const postState = {
        message: response.data.message,
        posts: response.data.posts,
      };
      return dispatch(postsSuccess(postState));
    })
    .catch((error) => {
      return dispatch(postsError(error));
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
