import {FETCH_POSTS, FETCH_TRENDING_POSTS, LIKE_POST, UNLIKE_POST, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR} from "../cases.js";

const initialState = {
  loading: false,
  posts: [],
  trendingPosts: [],
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
    case FETCH_TRENDING_POSTS:
      return {
        ...state,
        trendingPosts: [...action.payload.trendingPosts],
        message: action.payload.message,
      }
    case POSTS_REQUEST:
      return {
        ...state,
        loading: action.payload.loading,
        postsError: null,
      };
    case POSTS_SUCCESS:
      return {
        ...state,
        loading: action.payload.loading,
        postsError: null,
        posts: [...action.payload.posts]
      };
    case POSTS_ERROR:
      return {
        ...state,
        loading: action.payload.loading,
        postsError: action.payload.error,
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