import {FETCH_POSTS, LIKE_POST, UNLIKE_POST, LIST_ERRORS} from "../cases.js";

import axios from "axios";

export const fetchPosts = (options={}) => {
  console.log("fetching")
  const sortOption = options.sortOption || "new";
  const fetchLimit = options.fetchLimit || 10;
  return function(dispatch) {
    axios({
      method: "get",
      url: `/api/posts/${sortOption}`,
      data: {
        fetchLimit: fetchLimit,
      }
    })
      .then((response) => {
        const postState = {
          message: response.message,
          posts: response.posts,
        };
        console.log(postState);
        dispatch({
          type: FETCH_POSTS,
          payload: postState,
        });
      })
      .catch((error) => {
        console.log(error.response);
        dispatch({
          type: LIST_ERRORS,
          payload: error.response,
        })
      });
    }
};

export const likePost = (postId, userId) => {
  return function(dispatch) {
    
    ///api actions

    dispatch({
      type: LIKE_POST,
      payload: 0,
    })
  };
};

export const unlikePost = (postId, userId) => {
  return function(dispatch) {
    //api actions
    dispatch({
      type: UNLIKE_POST,
      payload: 0,
    });
  };
};


//downvotes later??
export const downvotePost = (postdId, userId) => {

};
export const removeDownvote = (postId, userId) => {

};
