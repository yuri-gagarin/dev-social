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

  it("successfully creates post store", () => {
    const posts = [];
    for (let i = 0; i < 5; i++) {
      posts.push(generatePost())
    }
    const payload = {
      message: "success",
      posts: [...posts],
    }
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: payload,
      });
    });

    const expectedActions = [
      {type: types.FETCH_POSTS},
      {type: types.POSTS_SUCCESS},
    ];

    const store = mockStore({postsState: []});

    return store.dispatch(actions.fetchPosts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

  })

  it("throws an error when the request fails", () => {
    const data = {
      message: "Error",
      error: new Error("Something went wrong")
    };

    moxios.wait(() => {
      let request = mocies.requests.mostRecent();
      request.respondWith({
        status: 500,
        response: data,
      });

      const expectedActions = [
        {type: types.FETCH_POSTS},
        {type: types.POSTS_FAILURE, payload: data},
      ];
      const store = mockStore({postsState: []});
      return store.dispatch(actions.fetchPosts())
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  })
});