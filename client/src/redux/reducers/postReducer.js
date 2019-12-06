import { FETCH_POSTS, FETCH_TRENDING_POSTS, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR,
         LIKE_POST, REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE } from "../cases.js";

const initialState = {
  message: "",
  loading: false,
  posts: [],
  trendingPosts: [],
  postsError: null,
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
        loading: true,
        postsError: null,
      };
    case POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        postsError: null,
        posts: [...action.payload.posts]
      };
    case POSTS_ERROR:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        postsError: action.payload.error,
      };
    case LIKE_POST:
      return {
        ...state,
        loading: false,
        postsError: null,
        message: action.payload.message,
        posts: [...action.payload.posts]
      };
    case REMOVE_POST_LIKE:
      return {
        ...state,
        loading: false,
        postsError: null,
        message: action.payload.message,
        posts: [...action.payload.posts]
      };
    case DISLIKE_POST:
      return {
        ...state,
        loading: false,
        postsError: null,
        message: action.payload.message,
        posts: [...action.payload.posts]
      };
    case REMOVE_POST_DISLIKE:
      return {
        ...state,
        loading: false,
        postsError: null,
        message: action.payload.message,
        posts: [...action.payload.posts]
      };
    default:
      return state;
  };
};


export default postReducer;