import commentsReducer from "../../src/redux/reducers/commentsReducer";
import store from '../../src/redux/store'
import { FETCH_COMMENTS, COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_ERROR, 
         LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE } from "../../src/redux/cases";

import { generateComment } from "../helpers/mockData";
    
const initialCommentsState = store.getState().commentsState;
//const initialCommentsState = testState.commentsState;


describe("{commentsReducer} tests", () => {
  const mockComments = [];
  beforeAll(() => {
    for (let i = 0; i < 10; i++) {
      mockComments.push(generateComment({userId: 1, postId: 1, commentId: i}));
    };
  })
  // general {commentsReducer} actions //
  describe("General {commentsReducer} actions", () => {
    // default no argument type //
    describe(`type: ${undefined}`, () => {
      it("Should return the initial state", () => {
        const expectedState = {
          statusCode: null,
          message: "",
          loading: false,
          comments: [],
          commentsError: null
        };
    
        expect(commentsReducer(undefined, {})).toEqual(expectedState);
      });
    });
    // END default no argument type //
    // COMMENTS_REQUEST type //
    describe(`type: ${COMMENTS_REQUEST}`, () => {
      it(`Should handle the ${COMMENTS_REQUEST} case`, () => {
        const payload = { message: "Loading", statusCode: null };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: true,
          comments: [],
          commentsError: null,
        };

        const action = { type: COMMENTS_REQUEST, payload: payload };
        const newState = commentsReducer(initialCommentsState, action);

        expect(newState).toEqual(expectedState);
      });

      it(`Should set the {commentsError} to NULL if present from previous action`, () => {
        // mock error state from previous error //
        const errorState = {
          ...initialCommentsState,
          statusCode: 500,
          message: "An error occured",
          commentsError: new Error("Ooops...")
        };
        // payload and expected state //
        const payload = { message: "Loading", statusCode: null };
        const expectedState = {
          ...errorState,
          statusCode: null,
          message: payload.message,
          loading: true,
          commentsError: null
        };
  
        const action = { type: COMMENTS_REQUEST, payload: payload };
        const newState = commentsReducer(errorState, action);
  
        expect(newState).toEqual(expectedState);
      });
    });
    // END COMMENTS_REQUEST type //
    // COMMENTS_SUCCESS type //
    describe(`type: ${COMMENTS_SUCCESS}`, () => {
      it(`Should handle the ${COMMENTS_SUCCESS} case`, () => {
        const payload = { message: "Success", comments: mockComments, statusCode: 200};
        const expectedState = {
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: COMMENTS_SUCCESS, payload: payload };
        const newState = commentsReducer(initialCommentsState, action);

        expect(newState).toEqual(expectedState);
      });

      it("Should set the {commentsError} to NULL if present from previous action", () => {
        // mock error state from previous error //
        const errorState = {
          ...initialCommentsState,
          statusCode: 500,
          message: "An error occured",
          commentsError: new Error("Ooops...")
        };
        // payload and expected state //
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: COMMENTS_SUCCESS, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END COMMENTS_SUCCESS type //
  });
  // END general {commentsReducer} actions //

  /*
  it(`Should handle the ${COMMENTS_ERROR} case`, () => {
    const error = new Error("Ooops...");
    const action = {
      type: COMMENTS_ERROR,
      payload: {
        message: error.message,
        error: error,
      }
    };
    const expectedCommentsState = {
      message: error.message,
      loading: false,
      comments: [],
      commentsError: {...error},
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${LIKE_COMMENT} case`, () => {
    const action = {
      type: LIKE_COMMENT,
      payload: {
        message: "Success",
        comments: [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null,
    }
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${REMOVE_COMMMENT_LIKE} case`, () => {
    const action = {
      type: REMOVE_COMMMENT_LIKE,
      payload: {
        message: "Removed Like",
        comments: [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  })
  it(`Should handle the ${DISLIKE_COMMENT} case`, () => {
    const action = {
      type: DISLIKE_COMMENT,
      payload: {
        message: "Disliked Comment",
        comments:  [...fakeComments],
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  it(`Should handle the ${REMOVE_COMMENT_DISLIKE} case`, () => {
    const action = {
      type: REMOVE_COMMENT_DISLIKE,
      payload: {
        message: "Removed comment dislike",
        comments: [...fakeComments]
      }
    };
    const expectedCommentsState = {
      message: action.payload.message,
      loading: false,
      comments: [...action.payload.comments],
      commentsError: null
    };
    expect(commentsReducer(initialCommentsState, action)).toEqual(expectedCommentsState);
  });
  */
});
