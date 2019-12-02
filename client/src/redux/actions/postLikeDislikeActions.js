import {LIKE_POST, REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE, POSTS_ERROR} from "../cases";
import axios from "axios";


// Actions for PostLike
const loginError = new Error("Must be logged in");
/**
 * Likes a Post and returns an action to reducer;
 * @param {string} postId - _id of the Post to alter.
 * @param {Object[]} currentPostState - Current state of the Post(s).
 * @return {Promise} A Promise which resolves to an action.
 */
export const likePost = (postId, currentPostState=[]) => {
  const token = localStorage.getItem("jwtToken");
  let error;
  //we should return an error if user is not logged in
  const options = {
    method: "post",
    url: "/api/posts/like_post/" + postId,
    headers: {"Authorization": `Bearer ${token}`}
  };
  return function(dispatch) {
    ///api actions
    if(!token) {
      const error = new Error("User not Logged in");
      return Promise.resolve(error)
        .then((error) => {
          return dispatch({
            type: POSTS_ERROR,
            payload: error
          });
        });
    }
    return axios(options)
      .then((response) => {
        console.log("here")
        //console.log(response);
        let {message, updatedPost} = response.data;
        let newPostState = currentPostState.map((post) => {
          if(post._id === updatedPost._id) {
            return {
              ...post, 
              likeCount: updatedPost.likeCount,
              dislikeCount: updatedPost.dislikeCount,
              markLiked: true,
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
        console.log("error")
        console.log(error)
        return dispatch({
          type: POSTS_ERROR,
          payload: error,
        });
      });
  };
};


export const removePostLike = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  const options = {
    method: "delete",
    url: "/api/posts/unlike_post/" + postId,
    headers: {"Authorization": `Bearer ${token}`}
  };
  return function(dispatch) {
    if(!token) {
      const error = new Error("User not Logged in");
      return Promise.resolve(error)
        .then((errror) => {
          return {
            type: POSTS_ERROR,
            payload: error,
          };
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
              dislikeCount: updatedPost.dislikeCount
            };
          }
          else {
            return post;
          }
        });
        dispatch({
          type: REMOVE_POST_LIKE, 
          payload: {
            message: message,
            posts: newPostState
          }
        });
      })
      .catch((error) => {
        dispatch({
          type: POSTS_ERROR,
          payload: error
        })
      })
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
      const error = new Error("User not Logged in");
      return Promise.resolve(error)
        .then((error) => {
          return dispatch({
            type: POSTS_ERROR,
            payload: error
          });
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
              markDisliked: true,
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
        return dispatch({
          type: POSTS_ERROR,
          payload: error,
        });
      });
  }
};

export const removePostDislike = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  if(!token) {
    return {
      type: POSTS_ERROR,
      payload: loginError
    };
  }
  else {
    return function(dispatch) {
      const options = {
        method: "delete",
        url: "/api/posts/remove_dislike/" + postId,
        headers: {"Authorization": `Bearer ${token}`}
      };
      axios(options) 
        .then((response) => {
          const {message, updatedPost} = response.data;
          let newPostState = currentPostState.map((post) => {
            if(post._id === updatedPost._id) {
              return {
                ...post,
                likeCount: updatedPost.likeCount,
                dislikeCount: updatedPost.dislikeCount,
              };
            }
            else {
              return post;
            }
          });
          dispatch({
            type: REMOVE_POST_DISLIKE,
            payload: {
              message: message,
              posts: newPostState,
            }
          });
        })
        .catch((error) => {
          dispatch({
            type: POSTS_ERROR,
            payload: error,
          });
        });
    }
  }
};
