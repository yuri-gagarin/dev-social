import {LIKE_POST, UNLIKE_POST} from "../cases.js";

import axios from "axios";

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
