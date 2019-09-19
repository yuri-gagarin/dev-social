import {FETCH_POSTS, LIKE_POST, UNLIKE_POST, LIST_ERRORS} from "../cases.js";

import axios from "axios";

export const fetchPosts = (options={}) => {
  console.log("fetching")
  const sortOption = options.sortOption || "new";
  const fetchLimit = options.fetchLimit || 10;
  return function(dispatch) {
    axios({
      method: "get",
      url: `/api/posts?q=${sortOption}`,
      data: {
        fetchLimit: fetchLimit,
      }
    })
      .then((response) => {
        console.log(response.data.posts)
        const postState = {
          message: response.data.message,
          posts: response.data.posts,
        };
        dispatch({
          type: FETCH_POSTS,
          payload: postState,
        });
      })
      .catch((error) => {
        console.log("here")
        console.log(error);
        dispatch({
          type: LIST_ERRORS,
          payload: error,
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
