import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../../src/redux/actions/postLikeDislikeActions";
import * as types from "../../src/redux/cases";
import store from "../../src/redux/store";

import {JWT_TOKEN} from "../../src/helpers/constants/appConstants";
import { loginError, generalError } from "../../src/helpers/commonErrors";

import moxios from "moxios";
import {generatePost} from "../helpers/mockData";

const middlewares = [thunk];
const testStore = configureMockStore(middlewares)(store.getState());

describe("Post {Like} {Dislike} action tests", () => {
  const posts = [];
  beforeAll(() => {
    for (let i = 0; i < 10; i++) {
      posts.push(generatePost({postId: i, userId: i}));
    }
  });
  // Context no user logged in or no jwt token //
  describe("User is NOT logged in / no JWT token presend in {localStorage}", () => {
    beforeEach(() => {
      localStorage.removeItem(JWT_TOKEN);
    });
    afterEach(() => {
      testStore.clearActions();
    })
    describe(`Action: {likePost}`, () => {
      it("Should throw an error and not allow an API call", () => {
        const postId = "afakeid";
        const currentPostsState = posts.map((post) => Object.assign({}, post));

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.default(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {removePostLike}", () => {
      it("Should throw an error and not allow an API call", () => {
        const postId = "afakeid";
        const currentPostsState = posts.map((post) => Object.assign({}, post));

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.removePostLike(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {dislikePost}", () => {
      it("Should throw an error and not allow an API call", () => {
        const postId = "afakeid";
        const currentPostsState = posts.map((post) => Object.assign({}, post));

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.dislikePost(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {removePostDislike}", () => {
      it("Should throw an error and not allow an API call", () => {
        const postId = "afakeid";
        const currentPostsState = posts.map((post) => Object.assign({}, post));        
        
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.removePostDislike(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
  // END Context with no user logged in or no jwt token //
  // Context with a logged in user //
  describe("User is logged in / JWT token present in {localStorage}", () => {
    beforeEach(() => {
      //localStorage mock token
      localStorage.setItem(JWT_TOKEN,  "a_fake_token")
      moxios.install();
    });
    afterEach(() => {
      localStorage.removeItem(JWT_TOKEN);
      moxios.uninstall();
      testStore.clearActions();
    })
    // {likePost} actions tests //
    describe(`Action: {likePost}`, () => {

      it(`Should dispatch a ${types.LIKE_POST} action`, () => {
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        // expected updated post //
        const updatedPost = {
          ...currentPostsState[0],
          likeCount: currentPostsState[0].likeCount += 1,
        };
        const postId = updatedPost._id;
        // expected posts to be passed to reducer//
        const expectedPost = {
          ...updatedPost,
          markLiked: true,
          markDisliked: false,
        }
        const newPostsState = currentPostsState.slice(1);
        newPostsState.unshift(expectedPost);
  
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "liked",
              updatedPost: updatedPost,
            }
          })
        });

        const expectedActions = [
          { type: types.LIKE_POST, payload: {message: "liked", posts: newPostsState} }
        ];

        return testStore.dispatch(actions.default(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
      
      it(`Should successfully dispatch a ${types.LIKE_POST} on a post which was previously disliked`, () => {
        // initial state setup //
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        currentPostsState[0].dislikeCount += 1;
        currentPostsState[0].markDisliked = true;
        currentPostsState[0].markLiked = false;
        // this is our mock API post response //
        const updatedPost = {
          ...currentPostsState[0],
          dislikeCount: currentPostsState[0].dislikeCount - 1,
          likeCount: currentPostsState[0].likeCount + 1,
        };
        const postId = updatedPost._id;
        // these are the expected post and posts after redux action //
        const expectedPost = {
          ...updatedPost,
          markLiked: true,
          markDisliked: false
        };
        const newPostsState = currentPostsState.slice(1)
        newPostsState.unshift(expectedPost);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "liked",
              updatedPost: updatedPost,
            }
          });
        });

        const expectedActions = [
          { type: types.LIKE_POST, payload: {message: "liked", posts: newPostsState} }
        ];

        return testStore.dispatch(actions.default(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully handle an API error`, () => {
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        const postId = "randomid";
        const error = new Error("Oops");

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error
          });
        });
      
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.default(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {likePost} action tests //
    // {removePostLike} action tests //
    describe("Action: {removePostLike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_POST_LIKE} action`, () => {
        // in the mock state the post is liked
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        currentPostsState[0].likeCount += 1;
        currentPostsState[0].markLiked = true;
        // expected updated post //
        const updatedPost = {
          ...currentPostsState[0], 
          likeCount: currentPostsState[0].likeCount - 1,
        };
        const postId = updatedPost._id;
        // expected postsState to be passed to reducer //
        const expectedPost = {
          ...updatedPost,
          markLiked: false,
        }
        const newPostsState = posts.slice(1)
        newPostsState.unshift(expectedPost);
  
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "unlike post",
              updatedPost: updatedPost,
            }
          });
        });

        const expectedActions = [
          { type: types.REMOVE_POST_LIKE, payload: {message: "unlike post", posts: newPostsState} }
        ];

        return testStore.dispatch(actions.removePostLike(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully handle an API error`, () => {
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        const postId = "randomid";
        const error = new Error("Oops");

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error
          });
        });

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.removePostLike(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {removePostLike} action tests //
    // {dislikePost} action tests //
    describe("Action: {dislikePost}", () => {
      it(`Should successfully dispatch a ${types.DISLIKE_POST} action`, () => {
        // current postsState //
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        // expected updated post
        const updatedPost = {
          ...currentPostsState[0],
          dislikeCount: currentPostsState[0].dislikeCount + 1,
        };
        const postId = updatedPost._id;
        // expected postsState //
        const expectedPost = {
          ...updatedPost,
          markDisliked: true,
          markLiked: false,
        };
        const newPostsState = currentPostsState.slice(1);
        newPostsState.unshift(expectedPost);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "disliked post",
              updatedPost: updatedPost,
            }
          })
        });

        const expectedActions = [
          { type: types.DISLIKE_POST, payload: {message: "disliked post", posts: newPostsState} }
        ];

        return testStore.dispatch(actions.dislikePost(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully dispatch a ${types.DISLIKE_POST} on a post which was previously liked`, () => {
        // intitial posts setup //
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        currentPostsState[0].likeCount += 1;
        currentPostsState[0].markLiked = true;
        currentPostsState[0].markDisliked = false;
        // this is our mock API post response //
        const updatedPost = {
          ...currentPostsState[0],
          dislikeCount: currentPostsState[0].dislikeCount + 1,
          likeCount: currentPostsState[0].likeCount - 1,
        };
        const postId = updatedPost._id;
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "disliked",
              updatedPost: updatedPost,
            }
          });
        });
        // these are the expected post and posts after redux action //
        const expectedPost = {
          ...updatedPost,
          markDisliked: true,
          markLiked: false
        };
        const newPostsState = currentPostsState.slice(1)
        newPostsState.unshift(expectedPost);

        const expectedActions = [
          { type: types.DISLIKE_POST, payload: {message: "disliked", posts: newPostsState} }
        ];

        return testStore.dispatch(actions.dislikePost(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully handle an error`, () => {
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        const postId = "randomid";
        const error = new Error("Oops");

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.dislikePost(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {dislikePost} action tests //
    // {removePostDislike} action tests //
    describe("Action: {removePostDislike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_POST_DISLIKE} action`, () => {
        // current posts mockstate //
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        currentPostsState[0].markDisliked = true;
        currentPostsState[0].dislikeCount = 1;
        // updated post //
        const updatedPost = {
          ...currentPostsState[0],
          dislikeCount: currentPostsState[0].dislikeCount - 1,
        };
        const postId = updatedPost._id;
        // expected posts to be passed to reducer //
        const expectedPost = {
          ...updatedPost,
          markDisliked: false,
        }
        const newPostsState = posts.slice(1);
        newPostsState.unshift(expectedPost);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "disliked",
              updatedPost: updatedPost
            }
          })
        });

        const expectedActions = [
          { type: types.REMOVE_POST_DISLIKE, payload: {message: "disliked", posts: newPostsState} }
        ];

        return testStore.dispatch(actions.removePostDislike(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully handle an API error`, () => {
        const currentPostsState = posts.map((post) => Object.assign({}, post));
        const postId = "randomid";
        const error = new Error("Oops");

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });

        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error} }
        ];
        
        return testStore.dispatch(actions.removePostDislike(postId, currentPostsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {removePostDislike} action tests //
  });
  // END Context with a logged in user //
});
// END Post {Like} {Dislike} action tests  //