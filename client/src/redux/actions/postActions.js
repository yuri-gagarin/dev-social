import { FETCH_TRENDING_POSTS, LIST_ERRORS, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR, 
        CREATE_POST, EDIT_POST, DELETE_POST } from "../cases";
//import {trimString} from "../../helpers/rendering/displayHelpers";
import axios from "axios";
import { postSearchOptions } from "../searchOptions";
import { isError } from "../../helpers/validators/dataValidators";
import { inputError, loginError, generalError } from "../../helpers/commonErrors";
import { JWT_TOKEN } from "../../helpers/constants/appConstants";
import { isEmpty } from "../../helpers/validators/dataValidators";


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
  if (isError(err)) error = err;
  if (isError(err.response)) error = err.response;
  if (isError(err.request)) error = err.request;
  if (!error) error = new Error("Something went wrong");

  return {
    type: POSTS_ERROR,
    payload: {
      message: error.message,
      error: error,
    }
  };
};

export const fetchPosts = (options = {}, currentPosts = []) => {
  const params = {
    from: options.from || null,
    toDate: options.toDate || null,
    filter: options.filter || postSearchOptions.filter.new,
    limit: options.limit || 10,
  };
  // type checking to avoid strange errors //
  // first argument should be an object //
  const firstArgValid = typeof options === "object";
  // sceond argument should be an array //
  const secondArgValid = Array.isArray(currentPosts);
  // 
  return function (dispatch) {
    if (!firstArgValid || !secondArgValid) {
      return Promise.resolve().then(() => {
        return dispatch(postsError(inputError("Invalid arguments passed to fetch...")));
      });
    }
    dispatch(postsRequest());
    return axios({
      method: "get",
      url: `/api/posts`,
      params: {...params},
    })
    .then((response) => {
      const { message, posts } = response.data;
      if(currentPosts.length === 0) {
        const newPostsState = {
          message: message,
          posts: [...posts]
        };
        return dispatch(postsSuccess(newPostsState));
      } else {
        const newPosts = [];
        for(let newPost of posts) {
          for(let oldPost of currentPosts) {
            if(newPost._id === oldPost._id) {
              newPosts.push(newPost);
            }
          }
        }
        const newPostsState = {
          message: message,
          posts: [...currentPosts, ...posts],
        }
        return dispatch(postsSuccess(newPostsState));
      }
    })
    .catch((error) => {
      return dispatch(postsError(error));
    });
  }
};


export const fetchTrendingPosts = () => {
  return function (dispatch) {
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

/**
 * Dispatches an API request to create a new Post.
 * @param {Object} postData - New Post data.
 * @param {Object[]} currentPosts - The current Post(s) displayed.
 * @return {Promise<Object>} A Promise which resolved to a Redux action.
 */
export const createPost = (postData, currentPosts = []) => {

  const token = localStorage.getItem(JWT_TOKEN);
  const { author, title, text } = postData;
  const options = {
    url: "/api/posts",
    method: "post",
    headers: {
      "Authorization": `${token}`
    },
    data: {
      author: author,
      title: title,
      text: text
    }
  };

  return function (dispatch) {
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(postsError(loginError));
      });
    }
    if(isEmpty(postData)) {
      return Promise.resolve().then(() => {
        return dispatch(postsError(generalError("Post data is empty")));
      })
    }
    dispatch(postsRequest());
    return axios(options)
      .then((response) => {
        const { message, newPost } = response.data;
        const newPostsArray = [...currentPosts, newPost];
        return dispatch({
          type: CREATE_POST,
          payload: {
            message: message,
            posts: newPostsArray
          }
        });
      })
      .catch((error) => {
        return dispatch(postsError(error));
      })
  }
};

/**
 * Dispatches an API request to save an existing Post.
 * @param {Object} postData - Edited Post data.
 * @param {Object[]} currentPosts - The current Post(s) displayed.
 * @return {Promise<Object>} A Promise which resolved to a Redux action.
 */
export const saveEditedPost = (postData = {}, currentPosts = []) => {
  
  const token = localStorage.getItem(JWT_TOKEN);
  const { _id, title, text } = postData;
  const options = {
    url: "/api/posts/" + _id,
    method: "patch",
    headers: {
      "Authorization": `${token}`
    },
    data: {
      title: title,
      text: text
    }
  };

  return function (dispatch) {
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(postsError(loginError));
      });
    }
    if(isEmpty(postData)) {
      return Promise.resolve().then(() => {
        return dispatch(postsError("Post data is empty"));
      })
    }
    dispatch(postsRequest());
    return axios(options)
      .then((response) => {
        const { message, updatedPost } = response.data;
        const updatedPosts = currentPosts.map((post) => {
          if (post._id === updatedPost._id) {
            return {
              ...updatedPost
            };
          } else {
            return post;
          }
        });
        return dispatch({
          type: EDIT_POST,
          payload: {
            message: message,
            posts: updatedPosts
          }
        });
      })
      .catch((error) => {
        return dispatch(postsError(error));
      });
  }
};

/**
 * Dispatches an API request to delete an existing Post.
 * @param {string} postId - A MongoDB ObjecID of the Post to be deleted.
 * @param {Object[]} currentPosts - The current Post(s) displayed.
 * @return {Promise<Object>} A Promise which resolved to a redux action.
 */
export const deletePost = (postId, currentPosts = []) => {
  
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    url: "/api/posts/" + postId,
    method: "delete",
    headers: {
      "Authorization": `${token}`
    }
  }
  return function(dispatch) {
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(postsError(loginError));
      });
    }
    if (!postId) {
      return Promise.resolve().then(() => {
        return dispatch(postsError(generalError("Can't resolve Post id")));
      });
    }
    dispatch(postsRequest());
    return axios(options)
      .then((response) => {
        const { message, deletedPost } = response.data;
        const newPosts = currentPosts.filter((post) => post._id !== deletedPost._id);
        return dispatch({
          type: DELETE_POST,
          payload: {
            message: message,
            posts: newPosts
          }
        });
      })
      .catch((error) => {
        console.log(error);
        return dispatch(postsError(error));
      });
  }
};

