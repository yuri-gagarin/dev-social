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
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          message: "success",
          posts: [...posts],
        }
      });
    });

    const expectedTypes = [
      {type: types.FETCH_POSTS},
    ];

    const store = mockStore({posts: []});

    return store.dispatch(actions.fetchPosts())
      .then(() => {
        console.log(store.getActions());
      })

  })
});