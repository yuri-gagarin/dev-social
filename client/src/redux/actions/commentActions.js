import { COMMENTS_SUCCESS, COMMENTS_REQUEST, COMMENTS_ERROR } from "../cases";

//import {trimString} from "../../helpers/rendering/displayHelpers";
import axios from "axios";
import { isError } from "util";
import { JWT_TOKEN } from "../../helpers/constants/appConstants";
import { loginError } from "../../helpers/commonErrors";

export const commentsRequest = () => {
  return  {
    type: COMMENTS_REQUEST,
    payload: {
      message: "Loading"
    },
  }
}
export const commentsSuccess = (data) => {
  return {
    type: COMMENTS_SUCCESS,
    payload: {
      message: data.message,
      posts: data.posts,
    }
  };
};
export const commentsError = (err) => {
  let error;
  //some checking of the err object to make sure we are working with right data
  if(isError(err)) error = err;
  if(isError(err.response)) error = err.response;
  if(isError(err.request)) error = err.request;
  if(!error) error = new Error("Something went wrong");

  //console.log(err.response)

  return {
    type: COMMENTS_ERROR,
    payload: {
      message: error.message,
      error: error,
    }
  };
};

export const fetchComments = (options={}) => {
  const params = {
    postId: options.postId,
    from: options.from,
    toDate: options.toDate,
    filter: options.filter || postSearchOptions.filter.new,
    limit: options.limit || 10,
  };

  return function(dispatch) {
    //first a request action
    dispatch(commentsRequest());
    return axios({
      method: "get",
      url: `/api/comments`,
      params: {...params},
    })
    .then((response) => {
      const commentsState = {
        message: response.data.message,
        posts: response.data.posts,
      };
      return dispatch(commentsSuccess(commentsState));
    })
    .catch((error) => {
      return dispatch(commentsError(error));
    });
  }
};

// to do later //
export const createComment = (commentData) => {
  //first check if a user is logged in - save an extra API call //
  return function(dispatch) {
    const token = localStorage.getItem(JWT_TOKEN);
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
  }
};

export const saveEditedComment = (commentData) => {
  return function(dispatch) {
    const token = localStorage.getItem(JWT_TOKEN);
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
  }
};

export const deleteComment = (commentId) => {
  return function(dispatch) {
    const token = localStorage.getItem(JWT_TOKEN);
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
  }
};