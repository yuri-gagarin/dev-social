import commentsReducer from "../../src/redux/reducers/commentsReducer";
import store from '../../src/redux/store'
import { FETCH_COMMENTS, COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_ERROR, 
         LIKE_COMMENT, REMOVE_COMMMENT_LIKE, DISLIKE_COMMENT, REMOVE_COMMENT_DISLIKE, CREATE_COMMENT, EDIT_COMMENT, DELETE_COMMENT } from "../../src/redux/cases";

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
    // COMMENTS_ERROR type //
    describe(`type: ${COMMENTS_ERROR}`, () => {
      it(`Should handle the ${COMMENTS_ERROR} case`, () => {
        const error = new Error("Ooops...");
        const payload = { statusCode: 400, message: error.message, error: error };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          commentsError: error
        };

        const action = { type: COMMENTS_ERROR, payload: payload };
        const newState = commentsReducer(initialCommentsState, action);
        
        expect(newState).toEqual(expectedState);
      });
    });
    // END COMMENTS_ERROR type //
  });
  // END general {commentsReducer} actions //
  // Comment CRUD reducer actions //
  describe("Comment CRUD {commentsReducer} actions", () => {
    // CREATE_COMMENT type //
    describe(`type: ${CREATE_COMMENT}`, () => {
      it(`Should handle a ${CREATE_COMMENT} case`, () => {
        const comment = generateComment({userId: 1, postId: 1, commentId: 1});
        const payload = { statusCode: 200, message: "Created", comments: [comment]};
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: [comment],
          commentsError: null
        };

        const action = { type: CREATE_COMMENT, payload: payload };
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: CREATE_COMMENT, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END CREATE_COMMENT type //
    // EDIT_COMMENT type //
    describe(`type: ${EDIT_COMMENT}`, () => {
      it(`Should handle an ${EDIT_COMMENT} case`, () => {
        const comment = generateComment({userId: 1, commentId: 1, postId: 1});
        const payload = { statusCode: 200, message: "Edited", comments: [comment] };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: [comment],
          commentsError: null
        };

        const action = { type: EDIT_COMMENT, payload: payload};
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: EDIT_COMMENT, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END EDIT_COMMENT type //
    // DELETE_COMMENT type //
    describe(`type: ${DELETE_COMMENT}`, () => {
      it(`Should handle a ${DELETE_COMMENT} case`, () => {
        const payload = { statusCode: 200, message: "Deleted", comments: mockComments };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: DELETE_COMMENT, payload: payload };
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: DELETE_COMMENT, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END DELETE_COMMENT type //
  });
  // END Comment CRUD reducer actions //
  // Like, RemoveLike {commentReducer} actions //
  describe("Comment Like, RemoveLike {commentReducer} actions", () => {
    // LIKE_COMMENT type //
    describe(`type: ${LIKE_COMMENT}`, () => {
      it(`Should handle a ${LIKE_COMMENT} case`, () => {
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: LIKE_COMMENT, payload: payload };
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: LIKE_COMMENT, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END LIKE_COMMENT type //
    // REMOVE_COMMENT_LIKE type //
    describe(`type: ${REMOVE_COMMMENT_LIKE}`, () => {
      it(`Should handle a ${REMOVE_COMMMENT_LIKE} case`, () => {
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: [...payload.comments],
          commentsError: null
        };

        const action = { type: REMOVE_COMMMENT_LIKE, payload: payload };
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: REMOVE_COMMMENT_LIKE, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END REMOVE_COMMENT_LIKE type //
  });
  // END Like, RemoveLike {commentReducer} actions //
  // DislikeComment RemoveCommentDislike {commentReducer} actions //
  describe("DislikeComment, RemoveCommentDislike {commentsReducer} actions", () => {
    // DISLIKE_COMMENT type //
    describe(`type: ${DISLIKE_COMMENT}`, () => {
      it(`Should handle a ${DISLIKE_COMMENT} case`, () => {
        const payload = { message: "success", comments: mockComments, statusCode: 200 };
        const expectedState = {
        ...initialCommentsState,
        statusCode: 200,
        message: payload.message,
        loading: false,
        comments: payload.comments,
        commentsError: null
        };

        const action = { type: DISLIKE_COMMENT, payload: payload };
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: DISLIKE_COMMENT, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END DISLIKE_COMMENT type //
    // REMOVE_COMMENT_DISLIKE type //
    describe(`type: ${REMOVE_COMMENT_DISLIKE}`, () => {
      it(`Should handle a ${REMOVE_COMMENT_DISLIKE} type`, () => {
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...initialCommentsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: REMOVE_COMMENT_DISLIKE, payload: payload };
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
        const payload = { message: "Success", comments: mockComments, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: 200,
          message: payload.message,
          loading: false,
          comments: payload.comments,
          commentsError: null
        };

        const action = { type: REMOVE_COMMENT_DISLIKE, payload: payload };
        const newState = commentsReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END REMOVE_COMMENT_DISLIKE type //
  });
  // END DislikeComment RemoveCommentDislike {commentReducer} actions //
});
