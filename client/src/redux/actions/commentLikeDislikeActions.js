import { LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE } from "../cases";

import { JWT_TOKEN } from "../../helpers/constants/appConstants";
import { commentsError } from "./commentActions";
import { loginError } from "../../helpers/commonErrors";
import axios from "axios";

export const likeComment = ({commentId, postId}, currentCommentState = []) => {
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
        let newCommentsState = currentCommentState.map((comment) => {
          if(comment._id === updatedComment._id) {
            return {
              ...comment, 
              likeCount: updatedComment.likeCount,
              dislikeCount: updatedComment.dislikeCount,
              markLiked: true,
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


export const removeCommentLike = ({commentId, postId}, currentCommentState=[]) => {
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
        let newCommentsState = currentCommentState.map((comment) => {
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