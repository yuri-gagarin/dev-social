import postReducer from "../../src/redux/reducers/postReducer";
import * as postActions from "../../src/redux/actions/postActions";

import * as cases from "../../src/redux/cases";
import store from "../../src/redux/store";
import { generatePost } from "../helpers/mockData";

const testState = store.getState();
const postsState = testState.postsState;

describe("postReducer", () => {

  it("Should return the initial state", () => {
    expect(postReducer(undefined, {})).toEqual(postState);
  });

  it("Should handle a POSTS_REQUEST case", () => {
    const action = postActions.postsRequest();
    const expectedState = {
      ...initialState,
      loading: true,
      postsError: null,
    }
    const newState = postReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it("Should handle a POSTS_SUCCESS case", () => {
    const data = {message: "Great Success!", posts: [1,2,3]};
    const action = postActions.postsSuccess(data);
    const expectedState = {
      ...initialState,
      loading: false,
      postsError: null,
      posts: [...data.posts]
    }
    const newState = postReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it(`Should handle a ${cases.LIKE_POST} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, {type: cases.LIKE_POST, payload: payload});
    expect(newState).toEqual(expectedState);
  });
  it(`Should handle a ${cases.REMOVE_POST_LIKE} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, {type: cases.LIKE_POST, payload: payload});
    expect(newState).toEqual(expectedState);
  });
  it(`Should handle a ${cases.DISLIKE_POST} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, {type: cases.LIKE_POST, payload: payload});
    expect(newState).toEqual(expectedState);
  });
  it(`Should handle a ${cases.REMOVE_POST_DISLIKE} case`, () => {
    const payload = {message: "Successs", posts: [1,2,3,4,5]};
    const expectedState = {
      ...postsState,
      postsError: null,
      posts: [...payload.posts],
    };
    const newState = postReducer(postsState, {type: cases.LIKE_POST, payload: payload});
    expect(newState).toEqual(expectedState);
  });

  it("Should handle a POSTS_ERROR case", () => {
    const error = new Error("Bad request");
    const action = postActions.postsError(error);
    const expectedState = {
      ...initialState,
      loading: false,
      postsError: error,
    };
    const newState = postReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });
})