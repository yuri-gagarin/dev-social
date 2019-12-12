import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import store from "../../src/redux/store";

import {JWT_TOKEN} from "../../src/helpers/constants/appConstants";
import { loginError, generalError } from "../../src/helpers/commonErrors";
import * as actions from "../../src/redux/actions/postActions";
import * as types from "../../src/redux/cases";

import moxios from "moxios";
import {generatePost} from "../helpers/mockData";

const middlewares = [thunk];
const testStore = configureMockStore(middlewares)(store.getState());

const posts = [];
for (let i = 0; i < 10; i++) {
  posts.push(generatePost({postId: i, userId: i}));
}
//throw in some post navbar tests here
describe("Post Actions Tests", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
    testStore.clearActions();
  });
  // Context user is not logged in or no JWT TOKEn
  describe("Post fetch tests", () => {
    it("successfuly mock fetches some posts", () => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            message: "success",
            posts: posts,
          }
        });
      });
  
      const expectedActions = [
        {type: types.POSTS_REQUEST, payload: {message: "Loading"}},
        {type: types.POSTS_SUCCESS, payload: {message: "success", posts: posts}},
      ];  
      return testStore.dispatch(actions.fetchPosts())
        .then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
    });

    it("throws an error when the request fails", () => {
      const error = generalError("Ooops...");
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.reject({
          status: 500,
          error: error,
        })
      });  
      const expectedActions = [
        {type: types.POSTS_REQUEST, payload: {message: "Loading"}},
        {type: types.POSTS_ERROR, payload: {message: error.message, error: error}},
      ];
      return testStore.dispatch(actions.fetchPosts())
        .then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
    });
  });

  
});
