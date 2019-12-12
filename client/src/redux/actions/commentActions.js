import { COMMENTS_SUCCESS, COMMENTS_REQUEST, CREATE_COMMENT, COMMENTS_ERROR } from "../cases";

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
export const commentsSuccess = ({message, comments} = {}) => {
  return {
    type: COMMENTS_SUCCESS,
    payload: {
      message: message,
      comments: comments,
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

export const fetchComments = (options = {}) => {
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
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
    dispatch(commentsRequest());
    return axios(options)
      .then((response) => {
        const { message, newComment } = response.data;
        const updatedComments = [...currentComments, newComment];
        return dispatch({
          type: CREATE_COMMENT,
          payload: {
            message: message,
            comments: updatedComments,
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      })
  }
};

export const saveEditedComment = ({text, author}, currentComments = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    url: "/api/comments",
    method: "patch",
    data: {
      text: text,
      author: author,
    }
  };
  return function(dispatch) {
    // first check if a user is logged in - save an extra API call //
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      })
    }
    dispatch(commentsRequest());
    return axios(options)
      .then((response) => {
        const { updatedComment, message } = response.data;
        const updatedComments = currentComments.map((comment) => {
          if(comment._id === updatedComment._id) {
            return updatedComment;
          }
          else {
            return comment;
          }
        });
        return dispatch(commentsSuccess({message: message, comments: updatedComments}))
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};

export const deleteComment = (commentId) => {
  return function(dispatch) {
    const token = localStorage.getItem(JWT_TOKEN);
    const options = {
      url: "/api/comments/" + commentId,
      method: "delete",
    }
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      });
    }
    return axios(options)
      .then((response) => {
        const { deletedComment, message } = response.data;
        const updatedComments = currentComments.filter((comment) => {
          return comment._id !== deletedComment._id;
        });
        return dispatch(commentsSuccess({message: message, comments: updatedComments}))
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};