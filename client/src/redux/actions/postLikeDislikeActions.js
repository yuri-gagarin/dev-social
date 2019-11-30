import {LIKE_POST, REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE, POSTS_ERROR} from "../cases";
import axios from "axios";


// Actions for PostLike
const loginError = new Error("Must be logged in");

export const likePost = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  if(!token) {
    ///we should return an error if user is not logged in
    return {
      type: POSTS_ERROR,
      payload: loginError
    }
  }
  else {
    return function(dispatch) {
      const options = {
        method: "post",
        url: "/api/posts/like_post/" + postId,
        headers: {"Authorization": `Bearer ${token}`}
      };
      ///api actions
      axios(options)
        .then((response) => {
          let {message, updatedPost} = response.data;
          let newPostState = currentPostState.map((post) => {
            if(post._id === updatedPost._id) {
              return {
                ...post, 
                likeCount: updatedPost.likeCount,
                dislikeCount: updatedPost.dislikeCount,
              }
            }
            else {
              return post;
            }
          });
          dispatch({
            type: LIKE_POST,
            payload: {
              message: message,
              posts: newPostState,
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: POSTS_ERROR,
            payload: error,
          });
        });
    };
  }
};


export const removePostLike = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  if(!token) {
    return {
      type: POSTS_ERROR,
      payload: loginError,
    };
  }
  else {
    return function(dispatch) {
      const options = {
        method: "delete",
        url: "/api/posts/unlike_post/" + postId,
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
}

//PostDislikeHandling
export const dislikePost = (postId, currentPostState) => {
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
        method: "post",
        url: "/api/posts/dislike_post/" + postId,
        headers: {"Authorization": `Bearer ${token}`}
      };
      axios(options)
        .then((response) => {
          let {updatedPost, message} = response.data;
          let newPostState = currentPostState.map((post) => {
            if(post._id === updatedPost._id) {
              return {
                ...post,
                dislikeCount: updatedPost.dislikeCount
              };
            }
            else {
              return post;
            }
          });
          dispatch({
            type: DISLIKE_POST,
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
