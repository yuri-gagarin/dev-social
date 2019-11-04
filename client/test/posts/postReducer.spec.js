import postReducer from "../../src/redux/reducers/postReducer";
import * as postActions from "../../src/redux/actions/postActions";

describe("postReducer", () => {
  const initialState = {
    loading: false,
    posts: [],
    trendingPosts: [],
  };

  it("Should return the initial state", () => {
    expect(postReducer(undefined, {})).toEqual(initialState);
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