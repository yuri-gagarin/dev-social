import {LIKE_POST, REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE, POSTS_ERROR} from "../cases";
import {JWT_TOKEN} from "../../helpers/constants/appConstants";
import { postsError } from "./postActions";
import { loginError } from "../../helpers/commonErrors";
import axios from "axios";


// Actions for PostLike
/**
 * Likes a Post and returns an action to reducer;
 * @param {string} postId - _id of the Post to alter.
 * @param {Object[]} currentPostState - Current state of the Post(s).
 * @return {Promise} A Promise which resolves to an action.
 */
export const likePost = (postId, currentPostState=[]) => {
  const token = localStorage.getItem(JWT_TOKEN);
  //we should return an error if user is not logged in
  const options = {
    method: "post",
    url: "/api/posts/like_post/" + postId,
    headers: {"Authorization": `Bearer ${token}`}
  };
  return function(dispatch) {
    ///api actions
    if(!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(postsError(loginError));
        });
    }
    return axios(options)
      .then((response) => {
        let {message, updatedPost} = response.data;
        let newPostState = currentPostState.map((post) => {
          if(post._id === updatedPost._id) {
            return {
              ...post, 
              likeCount: updatedPost.likeCount,
              dislikeCount: updatedPost.dislikeCount,
              markLiked: true,
              markDisliked: false,
            }
          }
          else {
            return post;
          }
        });
        return dispatch({
          type: LIKE_POST,
          payload: {
            message: message,
            posts: newPostState,
          }
        })
      })
      .catch((error) => {
        return dispatch(postsError(error));
      });
  };
};


export const removePostLike = (postId, currentPostState) => {
  const token = localStorage.getItem(JWT_TOKEN);
  const options = {
    method: "delete",
    url: "/api/posts/unlike_post/" + postId,
    headers: {"Authorization": `Bearer ${token}`}
  };
  return function(dispatch) {
    if(!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(postsError(loginError));
        });
    }
    return axios(options)
      .then((response) => {
        const {message, updatedPost} = response.data;
        let newPostState = currentPostState.map((post) => {
          if(post._id === updatedPost._id) {
            return {
              ...post,
              likeCount: updatedPost.likeCount,
              dislikeCount: updatedPost.dislikeCount,
              markLiked: false,
            };
          }
          else {
            return post;
          }
        });
        return dispatch({
          type: REMOVE_POST_LIKE, 
          payload: {
            message: message,
            posts: newPostState
          }
        });
      })
      .catch((error) => {
        return dispatch(postsError(error));
      });
  }
}

//PostDislikeHandling
export const dislikePost = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  const options = {
    method: "post",
    url: "/api/posts/dislike_post/" + postId,
    headers: {"Authorization": `Bearer ${token}`}
  };
  
  return function(dispatch) {
    if(!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(postsError(loginError));
        });
    }
    return axios(options)
      .then((response) => {
        let {updatedPost, message} = response.data;
        let newPostState = currentPostState.map((post) => {
          if(post._id === updatedPost._id) {
            return {
              ...post,
              dislikeCount: updatedPost.dislikeCount,
              likeCount: updatedPost.likeCount,
              markDisliked: true,
              markLiked: false,
            };
          }
          else {
            return post;
          }
        });
        return dispatch({
          type: DISLIKE_POST,
          payload: {
            message: message,
            posts: newPostState,
          }
        });
      })
      .catch((error) => {
        return dispatch(postsError(error));
      });
  }
};

export const removePostDislike = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  
  const options = {
    method: "delete",
    url: "/api/posts/remove_dislike/" + postId,
    headers: {"Authorization": `Bearer ${token}`}
  };

  return function(dispatch) {
    if(!token) {
      return Promise.resolve()
        .then(() => {
          return dispatch(postsError(loginError));
        });
    }
    return axios(options) 
      .then((response) => {
        const {message, updatedPost} = response.data;
        let newPostState = currentPostState.map((post) => {
          if(post._id === updatedPost._id) {
            return {
              ...post,
              likeCount: updatedPost.likeCount,
              dislikeCount: updatedPost.dislikeCount,
              markDisliked: false,
            };
          }
          else {
            return post;
          }
        });
        return dispatch({
          type: REMOVE_POST_DISLIKE,
          payload: {
            message: message,
            posts: newPostState,
          }
        });
      })
      .catch((error) => {
        return dispatch(postsError(error));
      });
  }
};
