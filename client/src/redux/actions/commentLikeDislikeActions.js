import { LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE } from "../cases";

import { JWT_TOKEN } from "../../helpers/constants/appConstants";
import { commentsError, commentsRequest } from "./commentActions";
import { loginError, generalError } from "../../helpers/commonErrors";
import axios from "axios";

export const likeComment = (commentId, currentCommentsState = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  //we should return an error if user is not logged in
  const options = {
    method: "post",
    url: "/api/comments/like_comment/" + commentId,
    headers: {"Authorization": `${token}`}
  };
  return function(dispatch) {
    ///api actions
    if (!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(commentsError(loginError));
        });
    }
    dispatch(commentsRequest());
    // API request //
    return axios(options)
      .then((response) => {
        const { message, updatedComment } = response.data;
        const statusCode = response.status;
        const newCommentsState = currentCommentsState.map((comment) => {
          if (comment._id === updatedComment._id) {
            return {
              ...comment, 
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markLiked: true,
              markDisliked: false,
            }
          } else {
            return comment;
          }
        });
        return dispatch({
          type: LIKE_COMMENT,
          payload: {
            message: message,
            comments: newCommentsState,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  };
};


export const removeCommentLike = (commentId, currentCommentsState = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    method: "delete",
    url: "/api/comments/unlike_comment/" + commentId,
    headers: {"Authorization": `${token}`}
  };

  return function(dispatch) {
    if (!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(commentsError(loginError));
        });
    }
    dispatch(commentsRequest());
    // API request //
    return axios(options)
      .then((response) => {
        const {message, updatedComment} = response.data;
        const statusCode = response.status;
        const newCommentsState = currentCommentsState.map((comment) => {
          if (comment._id === updatedComment._id) {
            return {
              ...comment,
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markLiked: false,
            };
          } else {
            return comment;
          }
        });
        return dispatch({
          type: REMOVE_COMMMENT_LIKE, 
          payload: {
            message: message,
            comments: newCommentsState,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  };
};

// CommentDislike actions //

export const dislikeComment = (commentId, currentCommentsState = []) => {
  const token = localStorage.getItem("jwtToken");
  const options = {
    method: "post",
    url: "/api/comments/dislike_comment/" + commentId,
    headers: {"Authorization": `${token}`},
  };
  
  return function(dispatch) {
    // some data checking //
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      });
    }
    if (!commentId) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(generalError));
      });
    }
    dispatch(commentsRequest());
    // API request //
    return axios(options)
      .then((response) => {
        const { updatedComment, message } = response.data;
        const statusCode = response.status;
        const newCommentsState = currentCommentsState.map((comment) => {
          if (comment._id === updatedComment._id) {
            return {
              ...comment,
              dislikeCount: updatedComment.dislikeCount,
              likeCount: updatedComment.likeCount,
              markDisliked: true,
              markLiked: false,
            };
          } else {
            return comment;
          }
        });
        return dispatch({
          type: DISLIKE_COMMENT,
          payload: {
            message: message,
            comments: newCommentsState,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};

export const removeCommentDislike = (commentId, currentCommentsState = []) => {
  const token = localStorage.getItem("jwtToken");
  
  const options = {
    method: "delete",
    url: "/api/comments/remove_dislike/" + commentId,
    headers: {"Authorization": `Bearer ${token}`}
  };

  return function(dispatch) {
    // some data checking //
    if (!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      });
    }
    if (!commentId) {
      return Promise.resolve().then(() => {
        return dispatch(generalError("Can't resolve comment..."));
      });
    }
    dispatch(commentsRequest());
    // API request //
    return axios(options) 
      .then((response) => {
        const { message, updatedComment } = response.data;
        const statusCode = response.status;
        const newCommentsState = currentCommentsState.map((comment) => {
          if (comment._id === updatedComment._id) {
            return {
              ...comment,
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markDisliked: false,
            };
          } else {
            return comment;
          }
        });
        return dispatch({
          type: REMOVE_COMMENT_DISLIKE,
          payload: {
            message: message,
            comments: newCommentsState,
            statusCode: statusCode
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};