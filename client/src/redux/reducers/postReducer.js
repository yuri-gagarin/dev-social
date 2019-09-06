import {FETCH_POSTS, LIKE_POST, UNLIKE_POST} from "../cases.js";
const initialState = {
  posts: [],
};
const postReducer = (state=initialState, action) => {
  switch(action.type) {
    case FETCH_POSTS: 
      return {
        ...state,
        posts: [...action.payload],
      }
    case LIKE_POST:
      return {
        ...state,
      };
    case UNLIKE_POST:
      return {
        ...state,
      };
    default:
      return state;
  };
};


export default postReducer;