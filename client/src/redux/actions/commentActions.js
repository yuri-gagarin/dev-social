import { COMMENTS_SUCCESS, COMMENTS_REQUEST, CREATE_COMMENT, COMMENTS_ERROR, EDIT_COMMENT, DELETE_COMMENT } from "../cases";

import axios from "axios";
import { isError } from "../../helpers/validators/dataValidators";
import { JWT_TOKEN } from "../../helpers/constants/appConstants";
import { loginError, generalError } from "../../helpers/commonErrors";

export const commentsRequest = () => {
  return  {
    type: COMMENTS_REQUEST,
    payload: {
      message: "Loading",
      statusCode: null
    },
  }
};
export const commentsSuccess = ({message, comments} = {}) => {
  return {
    type: COMMENTS_SUCCESS,
    payload: {
      message: message,
      comments: comments,
    }
  };
};

/**
 * Generates a COMMENTS_ERROR action
 * @param {Object} err - an object presumed to be an Error
 * @return {Object}  A Redux error action object
 */
export const commentsError = (err) => {
  let error, statusCode;
  // some checking of the err object to make sure we are working with right data //
  if (isError(err)) error = err;
  if (isError(err.response)) error = err.response;
  if (isError(err.request)) error = err.request;
  if (!error) error = new Error("Something went wrong");

  // check for a status code in possible response, otherwise error is probably on user end //
  if (err.response && err.response.status) {
    statusCode = err.response.status;
  } else if (err.status) {
    statusCode = err.status;
  } else {
    statusCode = 400;
  }
  return {
    type: COMMENTS_ERROR,
    payload: {
      message: error.message,
      error: error,
      statusCode: statusCode
    }
  };
};

export const fetchComments = (options = {}) => {
  const params = {
    postId: options.postId,
    from: options.from,
    toDate: options.toDate,
    filter: options.filter || commentSearchOptions.filter.new,
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
export const createComment = ({text, author}, currentComments = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    url: "/api/comments",
    method: "post",
    data: {
      text: text,
      author: author,
    }
  };
  return function(dispatch) {
    // first check if a user is logged in - save an extra API call //
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
    dispatch(commentsRequest());
    return axios(options)
      .then((response) => {
        const { message, newComment } = response.data;
        const statusCode = response.status;
        const updatedComments = [...currentComments, newComment];
        return dispatch({
          type: CREATE_COMMENT,
          payload: {
            message: message,
            comments: updatedComments,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      })
  }
};

export const saveEditedComment = ({_id, text}, currentComments = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    url: "/api/comments/" + _id,
    method: "patch",
    data: {
      text: text,
    }
  };
  return function(dispatch) {
    // first check if a user is logged in - save an extra API call //
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
    dispatch(commentsRequest());
    // API request //
    return axios(options)
      .then((response) => {
        const { updatedComment, message } = response.data;
        const statusCode = response.status;
        const updatedComments = currentComments.map((comment) => {
          if(comment._id === updatedComment._id) {
            return updatedComment;
          }
          else {
            return comment;
          }
        });
        return dispatch({
          type: EDIT_COMMENT,
          payload: {
            message: message,
            comments: updatedComments,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};

export const deleteComment = (commentId, currentComments = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    url: "/api/comments/" + commentId,
    method: "delete",
  }
  return function(dispatch) {
    // data checking to prevent a useless API call //
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      });
    }
    if (!commentId || (typeof commentId !== "string")) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(generalError("Wrong input")));
      });
    }
    dispatch(commentsRequest());
    // API request //
    return axios(options)
      .then((response) => {
        const { deletedComment, message } = response.data;
        const statusCode = response.status;
        const updatedComments = currentComments.filter((comment) => {
          return comment._id !== deletedComment._id;
        });
        return dispatch({
          type: DELETE_COMMENT,
          payload: {
            message: message,
            comments: updatedComments,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};