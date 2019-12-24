import { FETCH_COMMENTS, COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_ERROR, 
         LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE, CREATE_COMMENT, EDIT_COMMENT, DELETE_COMMENT } from "../cases";

const initialState = {
  statusCode: null,
  message: "",
  loading: false,
  comments: [],
  commentsError: null
};

const commentsReducer = (state = initialState, action) => {
  switch(action.type) {
    case COMMENTS_REQUEST: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: true,
        message: action.payload.message,
        commentsError: null
      };
    case COMMENTS_SUCCESS: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null
      };
    case CREATE_COMMENT: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null,
      };
    case EDIT_COMMENT: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null
      };
    case DELETE_COMMENT: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null
      };
    case LIKE_COMMENT: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null,
      };
    case REMOVE_COMMMENT_LIKE:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null,
      };
    case DISLIKE_COMMENT:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null,
      };
    case REMOVE_COMMENT_DISLIKE: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        comments: [...action.payload.comments],
        commentsError: null,
      }; 
    case COMMENTS_ERROR: 
      return {
        ...state,
        statusCode: action.payload.statusCode,
        loading: false,
        message: action.payload.message,
        commentsError: action.payload.error
      };
    default: {
      return {
        ...state,
      };
    };
  };
};

export default commentsReducer;