import commentsReducer from "../../src/redux/reducers/commentsReducer";
import store from '../../src/redux/store'
import { FETCH_COMMENTS, COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_ERROR, 
         LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE } from "../../src/redux/cases";

import { generateComment } from "../helpers/mockData";
    
const initialCommentsState = store.getState().commentsState;
//const initialCommentsState = testState.commentsState;
const fakeComments = [];
for (let i = 0; i < 10; i++) {
  fakeComments.push(generateComment({userId: 1, postId: 1, commentId: i}));
};

describe("{commentsReducer} tests", () => {
  it("Should return the initial state", () => {
    const expectedCommentsState = {
      message: "",
      loading: false,
      comments: [],
      commentsError: null
    }
    expect(commentsReducer(undefined, {})).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${COMMENTS_REQUEST} case`, () => {
    const action = {
      type: COMMENTS_REQUEST,
      payload: {
        message: "Loading"
      },
    }
    const expectedCommentsState = {
      message: action.payload.message,
      loading: true,
      comments: [],
      commentsError: null,
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${COMMENTS_SUCCESS} case`, () => {
    const action = {
      type: COMMENTS_SUCCESS,
      payload: {
        message: "Success",
        comments: [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${COMMENTS_ERROR} case`, () => {
    const error = new Error("Ooops...");
    const action = {
      type: COMMENTS_ERROR,
      payload: {
        message: error.message,
        error: error,
      }
    };
    const expectedCommentsState = {
      message: error.message,
      loading: false,
      comments: [],
      commentsError: {...error},
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${LIKE_COMMENT} case`, () => {
    const action = {
      type: LIKE_COMMENT,
      payload: {
        message: "Success",
        comments: [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null,
    }
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${REMOVE_COMMMENT_LIKE} case`, () => {
    const action = {
      type: REMOVE_COMMMENT_LIKE,
      payload: {
        message: "Removed Like",
        comments: [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  })
  it(`Should handle the ${DISLIKE_COMMENT} case`, () => {
    const action = {
      type: DISLIKE_COMMENT,
      payload: {
        message: "Disliked Comment",
        comments:  [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${REMOVE_COMMENT_DISLIKE} case`, () => {
    const action = {
      type: REMOVE_COMMENT_DISLIKE,
      payload: {
        message: "Removed comment dislike",
        comments: [...fakeComments]
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
})