import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import store from "../../src/redux/store";

import {JWT_TOKEN} from "../../src/helpers/constants/appConstants";
import { loginError, generalError } from "../../src/helpers/commonErrors";
import * as actions from "../../src/redux/actions/postActions";
import * as types from "../../src/redux/cases";

import moxios from "moxios";
import { generatePost } from "../helpers/mockData";

const middlewares = [thunk];
const testStore = configureMockStore(middlewares)(store.getState());


// throw in some post navbar tests here //
describe("Post API / Redux Actions Tests", () => {
  const posts = [];
  beforeAll(() => {
    for (let i = 0; i < 10; i++) {
      posts.push(generatePost({postId: i, userId: i}));
    }
  });
  // Context a user is NOT logged in / JWT token NOT present //
  describe("User is NOT logged in / no JWT token present in {localStorage}", () => {
    beforeEach(() => {
      moxios.install();
      localStorage.removeItem(JWT_TOKEN);
    });
    afterEach(() => {
      moxios.uninstall();
      testStore.clearActions();
    });
    describe("Action: {fetchPosts}", () => {
      it("Successfully resolves a mock fetch request", () => {
        const currentPosts = [];
        const mockPostResponse = posts.map((post) => Object.assign({}, post));
        const expectedPosts = [...currentPosts, ...mockPostResponse];

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "success",
              posts: mockPostResponse,
            }
          });
        });
    
        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.POSTS_SUCCESS, payload: {message: "success", posts: expectedPosts} },
        ];  

        return testStore.dispatch(actions.fetchPosts({}, currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
  
      it("Correctly handles an API error", () => {
        const currentPosts = [];
        const error = generalError("Ooops...");

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error,
          })
        });  

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} },
        ];

        return testStore.dispatch(actions.fetchPosts({}, currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
          //console.log(testStore.getActions());
        });
      });
  });
  // END logged user NOT logged in context //
  // Context a user is logged in / JWT token present //
  describe("User is logged in / JWT token is present in {localStorage}", () => {
    beforeEach(()=> {
      moxios.install();
      localStorage.setItem(JWT_TOKEN, "afaketoken");
    });
    afterEach(() => {
      moxios.uninstall();
      localStorage.removeItem(JWT_TOKEN);
      testStore.clearActions();
    });
  });
  // END logged in user context //
  // Context user is not logged in or no JWT TOKEn
  
  });

  
});
