import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { JWT_TOKEN } from "../../src/helpers/constants/appConstants";
import { loginError, generalError } from "../../src/helpers/commonErrors";
import * as actions from "../../src/redux/actions/commentActions";
import * as types from "../../src/redux/cases";

import moxios from "moxios";
import { generateComment } from "../helpers/mockData";

const middleWares = [thunk];
const initialState = {};
const comments = [];

for (let i = 0; i < 5; i++) {
  comments.push(generateComment({userId: 1, postId: 1, commentId: i+1}));
}
const testStore = configureMockStore(middleWares)(initialState);


describe("Comments API actions tests", () => {
  describe("User is NOT logged in / no JWT token presend in {localStorage}", () => {
    beforeEach(() => {
      localStorage.removeItem(JWT_TOKEN);
    });
    afterEach(() => {
      testStore.clearActions();
    });
    describe("Action: {createComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        //const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        //const commentData = {};
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.createComment({}, [])).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {saveEditedComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        //const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.saveEditedComment({}, [])).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

    });
    describe("Action: {deleteComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        //const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const commentId = "afakeid";
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.deleteComment(commentId)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });

    });
  });
  describe("User is logged in / JWT token present in {localStorage}", () => {
    beforeEach(() => {
      moxios.install();
      localStorage.setItem(JWT_TOKEN, "afaketoken");
    });
    afterEach(() => {
      moxios.uninstall();
      localStorage.removeItem(JWT_TOKEN);
      testStore.clearActions();
    })
    // {createComment} action tests //
    describe("Action {createComment}", () => {
      it(`Should successfully dispatch a ${types.CREATE_COMMENT} action`, () => {
        //mock created comment and current state of comments array
        const comment = generateComment({userId: 1, postId: 1, commentId: Math.random() * 1000});
        const { text, author } = comment;
        const currentComments = comments.map((comment) => Object.assign({}, comment));
        //expected comments array with new created comment
        const newComments = [...currentComments, comment];

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              message: "Comment created",
              newComment: comment
            }
          })
        })
        const expectedActions = [
          { type: types.COMMENTS_REQUEST, payload: {message: "Loading"} },
          { type: types.CREATE_COMMENT, payload: {message: "Comment created", comments: [...newComments]} }
        ];

        return testStore.dispatch(actions.createComment({text: text, author: author}, currentComments)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
      it(`Should successfulle handle an API error and dispatch a ${types.COMMENTS_ERROR} action`, () => {
        const comment = generateComment({userId: 1, postId: 1, commentId: Math.random() * 1000});
        const { text, author } = comment;
        const currentComments = comments.map((comment) => Object.assign({}, comment));
        //error to be thrown // comments array should not be touched //
        const error = generalError("Server error");
        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.reject({
            status: 500,
            response: error
          });
        });
        const expectedActions = [
          { type: types.COMMENTS_REQUEST, payload: {message: "Loading"} },
          { type: types.COMMENTS_ERROR, payload: {message: error.message, error: error} },
        ];
        return testStore.dispatch(actions.createComment({text: text, author: author}, currentComments)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    // END {createComment} action tests //
  });
})