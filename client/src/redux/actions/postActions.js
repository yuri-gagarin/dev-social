import {FETCH_TRENDING_POSTS, LIST_ERRORS, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR} from "../cases";
//import {trimString} from "../../helpers/rendering/displayHelpers";
import axios from "axios";
import {postSearchOptions} from "../searchOptions";
import { isError } from "util";


export const postsRequest = () => {
  return {
    type: POSTS_REQUEST,
    payload: {
      message: "Loading"
    }
  };
};
export const postsSuccess = ({message, posts}) => {
  return {
    type: POSTS_SUCCESS,
    payload: {
      message: message,
      posts: posts,
    }
  };
};
export const postsError = (err) => {
  let error;
  //some checking of the err object to make sure we are working with right data
  if(isError(err)) error = err;
  if(isError(err.response)) error = err.response;
  if(isError(err.request)) error = err.request;
  if(!error) error = new Error("Something went wrong");

  return {
    type: POSTS_ERROR,
    payload: {
      message: error.message,
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
      url: `/api/posts`,
      params: {
        filter: "trending", 
        limit: 5,
      }
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
      return dispatch({
        type: FETCH_TRENDING_POSTS,
        payload: trendingPostsState,
      });
    })
    .catch((error) => {
      return dispatch({
        type: LIST_ERRORS,
        payload: error
      });
    });
  }
};
