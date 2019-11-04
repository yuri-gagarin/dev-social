import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../../src/redux/actions/postActions";
import * as types from "../../src/redux/cases";

import moxios from "moxios";
import {generatePost} from "../helpers/mockData";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


//throw in some post navbar tests here
describe("Post Navbar Tests", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });

  it("successfuly fetches some posts", () => {
    const posts = [];
    for (let i = 0; i < 5; i++) {
      posts.push(generatePost())
    }
    const fetchRequest = actions.postsRequest();
    const response = {
      message: "success",
      posts: [...posts],
    }
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: response,
      });
    });

    const payload = {
      ...response,
      loading: false,
    }

    const expectedActions = [
      {type: types.POSTS_REQUEST, payload: fetchRequest.payload},
      {type: types.POSTS_SUCCESS, payload: payload},
    ];

    const store = mockStore({postsState: []});

    return store.dispatch(actions.fetchPosts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

  })

  it("throws an error when the request fails", () => {

    const API_Error = new Error("Something went wrong");
    const errorResponse = {
      message: API_Error.message,
      error: API_Error,
      loading: false,
    };
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.reject(API_Error)
    });
    const {payload} = actions.postsRequest();

    const expectedActions = [
      {type: types.POSTS_REQUEST, payload: payload},
      {type: types.POSTS_ERROR, payload: errorResponse},
    ];
    const store = mockStore({postsState: []});
    return store.dispatch(actions.fetchPosts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
  });
});