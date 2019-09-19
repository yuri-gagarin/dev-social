import {FETCH_POSTS, LIKE_POST, UNLIKE_POST} from "../cases.js";
const initialState = {
  posts: [],
};
const postReducer = (state=initialState, action) => {
  switch(action.type) {
    case FETCH_POSTS: 
      //console.log(action.payload)
      return {
        ...state,
        posts: [...action.payload.posts],
        message: action.payload.message,
      };
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