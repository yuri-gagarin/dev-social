import { COMMENTS_SUCCESS, COMMENTS_REQUEST, COMMENTS_ERROR } from "../cases";

//import {trimString} from "../../helpers/rendering/displayHelpers";
import axios from "axios";
import { isError } from "util";

export const commentsRequest = () => {
  return  {
    type: COMMENTS_REQUEST,
    payload: null,
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

};

export const deleteCOmment = (commentData) => {

};

export const editComment = (commentData) => {

}