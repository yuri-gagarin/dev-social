import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { JWT_TOKEN } from "../../src/helpers/constants/appConstants";
import * as actions from "../../src/redux/actions/commentLikeDislikeActions";
import * as types from "../../src/redux/cases";

import { loginError } from "../../src/helpers/commonErrors";

const initialState = {};
const currenCommentsState = [];
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
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.likeComment(commentId, currenCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {removeCommmentLike", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.removeCommentLike(commentId, currenCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {dislikeComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.dislikeComment(commentId, currenCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action {removeCommentDislike}", () => {
      it("Should throw an error and not allow an API call", () => {
        const commentId = "1234id";
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];
        return testStore.dispatch(actions.removeCommentDislike(commentId, currenCommentsState)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  describe("User is logged in / JWT token present in {localStorage}", () => {
    beforeEach(() => {
      //localStorage mock token
      localStorage.setItem(JWT_TOKEN,  "a_fake_token")
    });
    describe("Action: {likeComment}", () => {

    });
    describe("Action: {removeCommmentLike", () => {

    });
    describe("Action: {dislikeComment}", () =>{

    });
    describe("Action {removeCommentDislike}", () => {

    });
  });

})