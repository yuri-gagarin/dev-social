import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { JWT_TOKEN } from "../../src/helpers/constants/appConstants";
import * as actions from "../../src/redux/actions/commentLikeDislikeActions";
import * as types from "../../src/redux/cases";

import { loginError } from "../../src/helpers/commonErrors";
import { generateComment } from "../helpers/mockData";

import moxios from "moxios";


const initialState = {};
const comments = [];

for (let i = 0; i < 10; i++) {
  comments.push(generateComment({userId: 1, postId: 1, commentId: i}));
} 
const middlewares = [thunk];
const testStore = configureMockStore(middlewares)(initialState);




describe("Comments Like - Dislike Action tests", () => {

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
        const currentCommentsState = comments.slice();

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
        const currentCommentsState = comments.slice();

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
        const currentCommentsState = comments.slice();

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
        const currentCommentsState = comments.slice();

        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.removeCommentDislike(commentId, currentCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  describe("User is logged in / JWT token present in {localStorage}", () => {
    beforeEach(() => {
      //localStorage mock token
      localStorage.setItem(JWT_TOKEN,  "a_fake_token");
      moxios.install();
    });
    afterEach(() => {
      testStore.clearActions();
      moxios.uninstall();
    })
    describe("Action: {likeComment}", () => {
      it(`Should successfully dispatch a ${types.LIKE_COMMENT} action`, () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment) );
        // expected state //
        const newCommentsState = currentCommentsState.slice(1);
        const updatedComment = {
          ...currentCommentsState[0],
          likeCount: currentCommentsState[0].likeCount + 1,
          markLiked: true,
          markDisliked: false,
        };
        const commentId = updatedComment._id;
        newCommentsState.unshift(updatedComment);

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
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment) );
        currentCommentsState[0].dislikeCount += 1;
        currentCommentsState[0].markDisliked = true;
        //expected state
        const newCommentsState = currentCommentsState.slice(1);
        const updatedComment = {
          ...currentCommentsState[0],
          dislikeCount: currentCommentsState[0].dislikeCount - 1,
          markDisliked: false,
          likeCount: currentCommentsState[0].likeCount + 1,
          markLiked: true
        };
        const commentId = updatedComment._id;
        newCommentsState.unshift(updatedComment);

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
    describe("Action: {removeCommmentLike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_COMMMENT_LIKE} action`, () => {
        const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        currentCommentsState[0].dislikeCount += 1;
        currentCommentsState[0].markDisliked = true;
        // expected state //
        const newCommentsState = comments.slice(1);
        const updatedComment = {
          ...currentCommentsState[0],
          likeCount: currentCommentsState[0].likeCount - 1,
          markLiked: false,
        };
        const commentId = updatedComment._id;
        newCommentsState.unshift(updatedComment);

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
    describe("Action: {dislikeComment}", () =>{

    });
    describe("Action {removeCommentDislike}", () => {

    });
  });

})