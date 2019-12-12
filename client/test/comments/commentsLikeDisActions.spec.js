import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import store from "../../src/redux/store";

import { JWT_TOKEN } from "../../src/helpers/constants/appConstants";
import * as actions from "../../src/redux/actions/commentLikeDislikeActions";
import * as types from "../../src/redux/cases";

import { loginError } from "../../src/helpers/commonErrors";
import { generateComment } from "../helpers/mockData";

import moxios from "moxios";

const middlewares = [thunk];
const testStore = configureMockStore(middlewares)(store.getState());

describe("Comments {Like} - {Dislike} Action tests", () => {
  const comments = [];
  beforeAll(() => {
    for (let i = 0; i < 10; i++) {
      comments.push(generateComment({userId: 1, postId: 1, commentId: i}));
    } 
  });
  // Context no user logged in or no jwt token //
  describe("User is NOT logged in / no JWT token presend in {localStorage}", () => {
    beforeEach(() => {
      localStorage.removeItem(JWT_TOKEN);
    });
    afterEach(() => {
      testStore.clearActions();
    });
    describe("Action: {likeComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.likeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {removeCommmentLike", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.removeCommentLike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {dislikeComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.dislikeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action {removeCommentDislike}", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.removeCommentDislike(commentId, currentCommentsState)).then(() => {
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
      localStorage.setItem(JWT_TOKEN,  "a_fake_token");
      moxios.install();
    });
    afterEach(() => {
      localStorage.removeItem(JWT_TOKEN);
      moxios.uninstall();
      testStore.clearActions();
    })
    // {likeComment} action tests //
    describe("Action: {likeComment}", () => {
      
      it(`Should successfully dispatch a ${types.LIKE_COMMENT} action`, () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment) );
        // expected updated comment //
        const updatedComment = {
          ...currentCommentsState[0],
          likeCount: currentCommentsState[0].likeCount + 1,
        }
        const commentId = updatedComment._id;
        // expected comments to be passed to a reducer //
        const expectedComment = {
          ...updatedComment,
          markLiked: true,
          markDisliked: false,
        };
        const newCommentsState = currentCommentsState.slice(1);
        newCommentsState.unshift(expectedComment);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedComment: updatedComment,
            }
          });
        });

        const expectedActions = [
          { type: types.LIKE_COMMENT, payload: {message: "Success", comments: newCommentsState} }
        ];

        return testStore.dispatch(actions.likeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully dispatch a ${types.LIKE_COMMENT} on a comment which was disliked`, () => {
        // initial state setup //
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment) );
        currentCommentsState[0].dislikeCount += 1;
        currentCommentsState[0].markDisliked = true;
        currentCommentsState[0].markLiked = false;
        // this is our mock API comment response //
        const updatedComment = {
          ...currentCommentsState[0],
          dislikeCount: currentCommentsState[0].dislikeCount - 1,
          likeCount: currentCommentsState[0].likeCount + 1,
        };
        const commentId = updatedComment._id;
        // expected comments to be passed to a reducer //
        const expectedComment = {
          ...updatedComment,
          markLiked: true,
          markDisliked: false,
        };
        const newCommentsState = currentCommentsState.slice(1);
        newCommentsState.unshift(expectedComment);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedComment: updatedComment,
            }
          });
        });

        const expectedActions = [
          { type: types.LIKE_COMMENT, payload: {message: "Success", comments: newCommentsState } }
        ];

        return testStore.dispatch(actions.likeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it("Should successfully handle an API error", () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const commentId = "randomid";
        const error =  new Error("Ooops....");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.removeCommentLike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {likeComment} tests //
    // {removeCommentLike} action tests //
    describe("Action: {removeCommmentLike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_COMMMENT_LIKE} action`, () => {
        // in the mock state the comment is liked //
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        currentCommentsState[0].likeCount += 1;
        currentCommentsState[0].markLiked = true;
        // this is our mock API comment response //
        const updatedComment = {
          ...currentCommentsState[0],
          likeCount: currentCommentsState[0].likeCount - 1,
        };
        const commentId = updatedComment._id;    
        // expected comments to be passed to a reducer //
        const expectedComment = {
          ...updatedComment,
          markLiked: false,
        }
        const newCommentsState = comments.slice(1);
        newCommentsState.unshift(expectedComment);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedComment: updatedComment
            }
          });
        });
      
        const expectedActions = [
          { type: types.REMOVE_COMMMENT_LIKE, payload: {message: "Success", comments: newCommentsState} }
        ];

        return testStore.dispatch(actions.removeCommentLike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it("Should successfully handle an API error", () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const commentId = "randomid";
        const error =  new Error("Ooops....");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.removeCommentLike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {removeCommentLike} action tests //
    // {dislikeComment} action tests //
    describe("Action: {dislikeComment}", () => {
      it(`Should successfully dispatch a ${types.DISLIKE_COMMENT} action`, () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment) );
        // expected updated comment //
        const updatedComment = {
          ...currentCommentsState[0],
          dislikeCount: currentCommentsState[0].dislikeCount + 1,
        };
        const commentId = updatedComment._id;
        // expected comments to be passed to a reducer //
        const expectedComment = {
          ...updatedComment,
          markDisliked: true,
          markLiked: false,
        }
        const newCommentsState = currentCommentsState.slice(1);
        newCommentsState.unshift(expectedComment);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedComment: updatedComment,
            }
          });
        });

        const expectedActions = [
          { type: types.DISLIKE_COMMENT, payload: {message: "Success", comments: newCommentsState} }
        ];

        return testStore.dispatch(actions.dislikeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it(`Should successfully dispatch a ${types.DISLIKE_COMMENT} on a comment which was liked`, () => {
        // initial mock state setup //
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment) );
        currentCommentsState[0].likeCount += 1;
        currentCommentsState[0].markLiked = true;
        currentCommentsState[0].markDisliked = false;
        // this is our mock API post response //
        const updatedComment = {
          ...currentCommentsState[0],
          likeCount: currentCommentsState[0].likeCount - 1,
          dislikeCount: currentCommentsState[0].dislikeCount + 1,
        };
        const commentId = updatedComment._id;
        // expected commenst to be passed to reducer //
        const expectedComment = {
          ...updatedComment,
          markDisliked: true,
          markLiked: false,
        }
        const newCommentsState = currentCommentsState.slice(1);
        newCommentsState.unshift(expectedComment);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedComment: updatedComment,
            }
          });
        });

        const expectedActions = [
          { type: types.DISLIKE_COMMENT, payload: {message: "Success", comments: newCommentsState} }
        ];

        return testStore.dispatch(actions.dislikeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it("Should successfully handle an API error", () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const commentId = "randomid";
        const error =  new Error("Ooops....");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.dislikeComment(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {dislikeComment} actions tests //
    // {removeCommentDislike} tests //
    describe("Action {removeCommentDislike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_COMMENT_DISLIKE} action`, () => {
        // current comments mockstate //
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        currentCommentsState[0].dislikeCount += 1;
        currentCommentsState[0].markDisliked = true;
        // updated comment //
        const updatedComment = {
          ...currentCommentsState[0],
          likeCount: currentCommentsState[0].dislikeCount - 1,
        };
        const commentId = updatedComment._id;
        // expected comments to be passed to reducer //
        const expectedComment = {
          ...updatedComment,
          markDisliked: false,
        }
        const newCommentsState = comments.slice(1);
        newCommentsState.unshift(expectedComment);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Success",
              updatedComment: updatedComment
            }
          });
        });
      
        const expectedActions = [
          { type: types.REMOVE_COMMENT_DISLIKE, payload: {message: "Success", comments: newCommentsState} }
        ];

        return testStore.dispatch(actions.removeCommentDislike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

      it("Should successfully handle an API error", () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const commentId = "randomid";
        const error =  new Error("Ooops....");

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: error.message, error: error} }
        ];

        return testStore.dispatch(actions.removeCommentDislike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {removeCommentDislike} action tests //
  });
  // END Context with a logged in user //
});
// End Comment {Like} {Dislike} action tests //