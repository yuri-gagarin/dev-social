import { FETCH_POSTS, FETCH_TRENDING_POSTS, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR, CREATE_POST, EDIT_POST, DELETE_POST,
         LIKE_POST, REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE } from "../cases";

const initialState = {
  statusCode: null,
  message: "",
  loading: false,
  posts: [],
  trendingPosts: [],
  postsError: null
};
const postReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_POSTS: 
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
        statusCode: action.payload.statusCode,
        message: action.payload.message,
        loading: true,
        postsError: null
      };
    case POSTS_SUCCESS:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        message: action.payload.message,
        loading: false,
        posts: [...action.payload.posts],
        postsError: null
      };
    case CREATE_POST: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    case EDIT_POST: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    case DELETE_POST: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    case POSTS_ERROR:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        postsError: action.payload.error
      };
    case LIKE_POST:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    case REMOVE_POST_LIKE:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    case DISLIKE_POST:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    case REMOVE_POST_DISLIKE:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        posts: [...action.payload.posts],
        postsError: null
      };
    default:
      return {
        ...state
      };
  };
};


export default postReducer;