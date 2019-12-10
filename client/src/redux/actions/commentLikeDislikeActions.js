import { LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE } from "../cases";

import { JWT_TOKEN } from "../../helpers/constants/appConstants";
import { commentsError } from "./commentActions";
import { loginError, generalError } from "../../helpers/commonErrors";
import axios from "axios";

export const likeComment = (commentId, currentCommentsState = []) => {
  const token = localStorage.getItem(JWT_TOKEN);
  //we should return an error if user is not logged in
  const options = {
    method: "post",
    url: "/api/comments/like_comment/" + commentId,
    headers: {"Authorization": `Bearer ${token}`}
  };
  return function(dispatch) {
    ///api actions
    if(!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(commentsError(loginError));
        });
    }
    return axios(options)
      .then((response) => {
        let {message, updatedComment} = response.data;
        let newCommentsState = currentCommentsState.map((comment) => {
          if(comment._id === updatedComment._id) {
            return {
              ...comment, 
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markLiked: true,
              markDisliked: false,
            }
          }
          else {
            return comment;
          }
        });
        return dispatch({
          type: LIKE_COMMENT,
          payload: {
            message: message,
            comments: newCommentsState,
          }
        })
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
    headers: {"Authorization": `Bearer ${token}`}
  };
  return function(dispatch) {
    if(!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(commentsError(loginError));
        });
    }
    return axios(options)
      .then((response) => {
        const {message, updatedComment} = response.data;
        let newCommentsState = currentCommentsState.map((comment) => {
          if(comment._id === updatedComment._id) {
            return {
              ...comment,
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markLiked: false,
            };
          }
          else {
            return comment;
          }
        });
        return dispatch({
          type: REMOVE_COMMMENT_LIKE, 
          payload: {
            message: message,
            comments: newCommentsState,
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
    headers: {"Authorization": `Bearer ${token}`},
  };
  
  return function(dispatch) {
    // some data checking //
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      });
    }
    if(!postId || !commentId) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(generalError));
      });
    }
    return axios(options)
      .then((response) => {
        let {updatedComment, message} = response.data;
        let newCommentsState = currentCommentsState.map((comment) => {
          if(comment._id === updatedComment._id) {
            return {
              ...comment,
              dislikeCount: updatedComment.dislikeCount,
              markDisliked: true,
              markLiked: false,
            };
          }
          else {
            return comment;
          }
        });
        return dispatch({
          type: DISLIKE_COMMENT,
          payload: {
            message: message,
            comments: newCommentsState,
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
    if(!token) {
      return Promise.resolve().then(() => {
        return dispatch(commentsError(loginError));
      });
    }
    if(!commentId) {
      return Promise.resolve().then(() => {
        return dispatch(generalError("Can't resolve comment..."));
      });
    }
    return axios(options) 
      .then((response) => {
        const {message, updatedComment} = response.data;
        let newCommentsState = currentCommentsState.map((comment) => {
          if(comment._id === updatedComment._id) {
            return {
              ...comment,
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markDisliked: false,
            };
          }
          else {
            return comment;
          }
        });
        return dispatch({
          type: REMOVE_COMMENT_DISLIKE,
          payload: {
            message: message,
            comments: newCommentsState,
          }
        });
      })
      .catch((error) => {
        return dispatch(commentsError(error));
      });
  }
};