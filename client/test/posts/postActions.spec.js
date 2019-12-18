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
    // setup moxios, clear actions etc //
    beforeEach(() => {
      moxios.install();
      localStorage.removeItem(JWT_TOKEN);
    });
    afterEach(() => {
      moxios.uninstall();
      testStore.clearActions();
    });
    // {fetchPost} action tests //
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
        });
      });
    });
    // END {fetchPosts} action tests //
    // {createPost} action tests //
    describe("Action: {createPost}", () => {

      it("Should throw an error and not allow an API call", () => {

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.createPost({}, [])).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {createPost} action tests //
    // {saveEditedPost} action tests //
    describe("Action: {savedEditedPost}", () => {

      it("Should throw an error and not allow an API call", () => {

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.saveEditedPost({}, [])).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {saveEditedPost} action tests //
    // {deletePost} action tests //
    describe("Action: {deletePost}", () => {

      it("Should throw an error and not allow an API call", () => {

        const postId = "afakeid";
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.deletePost(postId)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {deletePost} action tests //
  });
  // END logged user NOT logged in / NO JWT token context //
  // Context a user is logged in / JWT token present //
  describe("User is logged in / JWT token is present in {localStorage}", () => {
    // setup moxios, localStorage etc //
    beforeEach(()=> {
      moxios.install();
      localStorage.setItem(JWT_TOKEN, "afaketoken");
    });
    afterEach(() => {
      moxios.uninstall();
      localStorage.removeItem(JWT_TOKEN);
      testStore.clearActions();
    });
    // {createPost} action tests //
    describe("Action {createPost}", () => {

      it(`Should successfully dispatch a ${types.CREATE_POST} action`, () => {
        // mock created Post and current state of Post(s) array //
        const currentPosts = posts.map((post) => Object.assign({}, post));
        const mockPost = generatePost({userId: 1, postId: 1})
        const { title, text, author } = mockPost;
        // expected Post(s) array with a new created Post //
        const newPosts = [...currentPosts, mockPost];
        // test for present authorization headers //
        let headers = {};

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          headers = request.headers;
          request.respondWith({
            status: 200,
            response: {
              message: "Post Created",
              newPost: mockPost
            }
          });
        });

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.CREATE_POST, payload: {message: "Post Created", posts: [...newPosts]} }
        ];

        return testStore.dispatch(actions.createPost({title: title, text: text, author: author}, currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
          // should set appropriate authorization header for request //
          expect(headers.Authorization).toBeDefined();
        });
      });
      
      it(`Should successfulle handle an API error and dispatch a ${types.POSTS_REQUEST} action`, () => {
        // mock created Post and current state of Post(s) array //
        const currentPosts = posts.map((post) => Object.assign({}, post));
        const mockPost = generatePost({userId: 1, postId: 1});
        const { title, text, author } = mockPost;
        // error to be thrown // currentPosts array should not be touched //
        const error = generalError("Server error");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error
          });
        });

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} },
        ];

        return testStore.dispatch(actions.createPost({title: title, text: text, author: author},currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {createPost} action tests //
    // {saveEditedPost} action tests //
    describe("Action {saveEditedPost}", () => {
      
      it(`Should successfully dispatch a ${types.EDIT_POST} action`, () => {
        // mock created Post and current state of Post(s) array //
        const currentPosts = posts.map((post) => Object.assign({}, post));
        const updatedPost = {
          ...currentPosts[0],
          text: "I've edited something",
          title: "I've edited title"
        };
        const { title, text, _id } = updatedPost;
        // expected Posts(s) //
        const newPosts = currentPosts.slice(1);
        newPosts.unshift(updatedPost);
        // test for present authorization headers //
        let headers = {};

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          headers = request.headers;
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedPost: updatedPost
            }
          });
        });

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.EDIT_POST, payload: {message: "Success", posts: [...newPosts]} }
        ];

        return testStore.dispatch(actions.saveEditedPost({title: title, text: text, _id: _id}, currentPosts)).then(() => {  
          expect(testStore.getActions()).toEqual(expectedActions);
          // should set appropriate authorization header for request //
          expect(headers.Authorization).toBeDefined();
        });
      });

      it(`Should successfulle handle an API error and dispatch a ${types.POSTS_ERROR} action`, () => {
        // current state of Post(s) array //
        const currentPosts = posts.map((post) => Object.assign({}, post));
        // error to be thrown // Post(s) array should not be touched //
        const { _id, title, text } = currentPosts[0]
        const error = generalError("Server error");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error
          });
        });

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} },
        ];
        return testStore.dispatch(actions.saveEditedPost({_id: _id, title: title, text: text}, currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {savedEditedPost} action tests //
    // {deletePost} action tests //
    describe("Action: {deletePost}", () => {

      it(`Should successfully dispatch a ${types.DELETE_POST} action`, () => {
        // mock Post state array //
        const currentPosts = posts.map((post) => Object.assign({}, post));
        const mockDeletedPost = {
          ...currentPosts[0]
        }
        const postId = mockDeletedPost._id;
        // expected posts after successful delete API request //
        const newPosts = currentPosts.slice(1);
        // test for present authorization headers //
        let headers = {};

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          headers = request.headers;
          request.respondWith({
            status: 200,
            response: {
              message: "Deleted",
              deletedPost: mockDeletedPost,
            }
          });
        });

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.DELETE_POST, payload: {message: "Deleted", posts: [...newPosts]} }
        ];

        return testStore.dispatch(actions.deletePost(postId, currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
          // should set appropriate authorization header for request //
          expect(headers.Authorization).toBeDefined();
        });
      });

      it(`Should successfulle handle an API error and dispatch a ${types.POSTS_ERROR} action`, () => {
        const currentPosts = posts.map((post) => Object.assign({}, post));
        //error to be thrown // posts array should not be touched //
        const postId = currentPosts[0];
        const error = generalError("Server error");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error
          });
        });

        const expectedActions = [
          { type: types.POSTS_REQUEST, payload: {message: "Loading"} },
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} },
        ];

        return testStore.dispatch(actions.deletePost(postId, currentPosts)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
  // END {deletePost} action tests //
  });
  // END logged in user context //
});
