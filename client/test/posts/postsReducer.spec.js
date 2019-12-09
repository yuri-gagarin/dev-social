import postReducer from "../../src/redux/reducers/postReducer";

import { POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR, LIKE_POST, 
         REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE } from "../../src/redux/cases";
import store from "../../src/redux/store";
import { generatePost } from "../helpers/mockData";

const testState = store.getState();
const postsState = testState.postsState;


describe("postReducer tests", () => {

  it("Should return the initial state", () => {
    const expectedState = {
      message: "",
      loading: false,
      postsError: null,
      posts: [],
      trendingPosts: [],
    };
    expect(postReducer(undefined, {})).toEqual(expectedState);
  });

  it(`Should handle a ${POSTS_REQUEST} case`, () => {
    const expectedState = {
      ...postsState,
      loading: true,
      postsError: null,
    }
    const newState = postReducer(postsState, {type: POSTS_REQUEST, payload: null} );
    expect(newState).toEqual(expectedState);
  });

  it(`Should handle a ${POSTS_SUCCESS} case`, () => {
    const payload = {message: "Great Success!", posts: [1,2,3]};
    const expectedState = {
      ...postsState,
      loading: false,
      postsError: null,
      posts: [...payload.posts]
    }
    const newState = postReducer(postsState, { type: POSTS_SUCCESS, payload: payload });
    expect(newState).toEqual(expectedState);
  });

  it(`Should handle a ${LIKE_POST} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      message: payload.message,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, { type: LIKE_POST, payload: payload });
    expect(newState).toEqual(expectedState);
  });
  it(`Should handle a ${REMOVE_POST_LIKE} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      message: payload.message,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, { type: REMOVE_POST_LIKE, payload: payload });
    expect(newState).toEqual(expectedState);
  });
  it(`Should handle a ${DISLIKE_POST} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      message: payload.message,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, { type: DISLIKE_POST, payload: payload });
    expect(newState).toEqual(expectedState);
  });
  it(`Should handle a ${REMOVE_POST_DISLIKE} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      message: payload.message,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, { type: REMOVE_POST_DISLIKE, payload: payload });
    expect(newState).toEqual(expectedState);
  });

  it("Should handle a POSTS_ERROR case", () => {
    const error = new Error("Bad request");
    const payload = {
      message: error.message,
      error: error,
    };
    const expectedState = {
      ...postsState,
      loading: false,
      message: error.message,
      postsError: error,
    };
    const newState = postReducer(postsState, { type: POSTS_ERROR, payload: payload });
    expect(newState).toEqual(expectedState);
  });
});
