import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { JWT_TOKEN } from "../../src/helpers/constants/appConstants";
import { loginError } from "../../src/helpers/commonErrors";
import * as actions from "../../src/redux/actions/commentActions";
import * as types from "../../src/redux/cases";

const middleWares = [thunk];
const initialState = {};
const comments = [];

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
        const commentData = {};
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.createComment(commentData)).then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe("Action: {saveEditedComment}", () => {
      it("Should throw an error and not allow an API call", () => {
        //const currentCommentsState = comments.map((comment) => Object.assign({}, comment));
        const commentData = {};
        const expectedActions = [
          { type: types.COMMENTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(actions.saveEditedComment(commentData)).then(() => {
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

  });
})