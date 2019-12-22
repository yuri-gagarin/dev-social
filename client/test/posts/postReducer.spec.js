import postReducer from "../../src/redux/reducers/postReducer";

import { POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR, LIKE_POST, 
         REMOVE_POST_LIKE, DISLIKE_POST, REMOVE_POST_DISLIKE } from "../../src/redux/cases";
import store from "../../src/redux/store";
import { generatePost } from "../helpers/mockData";

const initialPostsState = store.getState().postsState;

describe("postReducer tests", () => {
  const mockPosts = [];
  beforeAll(() => {
    for (let i = 0; i < 5; i++) {
      mockPosts.push(generatePost({userId: 1, postId: i}));
    }
  });
  // general {postReducer} actions //
  describe("general {postReducer} actions", () => {
    // default no argument type //
    describe(`type: ${null}`, () => {
      it("Should return the initial state", () => {
        const expectedState = {
          statusCode: null,
          message: "",
          loading: false,
          postsError: null,
          posts: [],
          trendingPosts: []
        };
    
        expect(postReducer(undefined, {})).toEqual(expectedState);
      });
    });
    // END default no argument type //
    // POSTS_REQUEST type // 
    describe(`type: ${POSTS_REQUEST}`, () => {
      it(`Should handle a ${POSTS_REQUEST} case`, () => {
        const payload = { message: "Loading", statusCode: null };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: true,
          postsError: null
        };
    
        const action = { type: POSTS_REQUEST, payload: payload };
        const newState = postReducer(initialPostsState, action);
    
        expect(newState).toEqual(expectedState);
      });
    });
    // END POSTS_REQUEST type //
    // POSTS_SUCCESS type //
    describe(`type: ${POSTS_SUCCESS}`, () => {
      it(`Should handle a ${POSTS_SUCCESS} case`, () => {
        const payload = { message: "Great Success!", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };
    
        const action = { type: POSTS_SUCCESS, payload: payload };
        const newState = postReducer(initialPostsState, action);
    
        expect(newState).toEqual(expectedState);
      });

      it(`Should set the {postsError} to NULL if present from previous action`, () => {
        // this is mock error state from presumed previous error //
        const errorState = {
          ...initialPostsState,
          statusCode: 500,
          message: "An error occured",
          postsError: new Error("oops")
        };
        // payload and expected state //
        const payload = { message: "Great Success!", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: payload.posts,
          postsError: null
        };

        const action = { type: POSTS_SUCCESS, payload: payload };
        const newState = postReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END POSTS_SUCCESS type //
    // POSTS_ERROR type //
    describe(`type: ${POSTS_ERROR}`, () => {
      it(`Should handle a ${POSTS_ERROR} case`, () => {
        const error = new Error("Bad request");
        const payload = {
          statusCode: 400,
          message: error.message,
          error: error,
        };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: error.message,
          loading: false,
          postsError: error,
        };
    
        const action = { type: POSTS_ERROR, payload: payload };
        const newState = postReducer(initialPostsState, action);
        
        expect(newState).toEqual(expectedState);
      });
    });
    // END POSTS_ERROR type //
  });
  // END general {postReducer} actons //

  // Post CRUD reducer actions //

  // END Post CRUD reducer actions //

  
  // Like, RemoveLike {postReducer} actions //
  describe("Like, RemoveLike {postReducer] actions", () => {
    // LIKE_POST type //
    describe(`type: ${LIKE_POST}`, () => {
      it(`Should handle a ${LIKE_POST} case`, () => {
        const payload =  { message: "Successs",  posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };
    
        const action = { type: LIKE_POST, payload: payload };
        const newState = postReducer(initialPostsState, action);
    
        expect(newState).toEqual(expectedState);
      });

      it(`Should set the {postsError} to NULL if present from previous action`, () => {
        // this is mock error state from presumed previous error //
        const errorState = {
          ...initialPostsState,
          statusCode: 500,
          message: "An error occured",
          postsError: new Error("oops")
        };
        // payload and expected state //
        const payload = { message: "Great Success!", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };

        const action = { type: LIKE_POST, payload: payload };
        const newState = postReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END LIKE_POST type //
    // REMOVE_POST_LIKE type //
    describe(`type: ${REMOVE_POST_LIKE}`, () => {
      it(`Should handle a ${REMOVE_POST_LIKE} case`, () => {
        const payload = { message: "Successs", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };
    
        const action = { type: REMOVE_POST_LIKE, payload: payload };
        const newState = postReducer(initialPostsState, action);
    
        expect(newState).toEqual(expectedState);
      });

      it(`Should set the {postsError} to NULL if present from previous action`, () => {
        // this is mock error state from presumed previous error //
        const errorState = {
          ...initialPostsState,
          statusCode: 500,
          message: "An error occured",
          postsError: new Error("oops")
        };
        // payload and expected state //
        const payload = { message: "Great Success!", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };

        const action = { type: REMOVE_POST_LIKE, payload: payload };
        const newState = postReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END REMOVE_POST_LIKE type //
  });
  // END Like, RemoveLike {postReducer} actions //
  // Dislike, RemoveDislike {postReducer} actions //
  describe("Dislike, RemoveDislike {postReducer} actions", () => {
    // DISLIKE_POST type //
    describe(`type: ${DISLIKE_POST}`, () => {
      it(`Should handle a ${DISLIKE_POST} case`, () => {
        const payload = { message: "Successs", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };
    
        const action = { type: DISLIKE_POST, payload: payload };
        const newState = postReducer(initialPostsState, action);
    
        expect(newState).toEqual(expectedState);
      });

      it(`Should set the {postsError} to NULL if present from previous action`, () => {
        // this is mock error state from presumed previous error //
        const errorState = {
          ...initialPostsState,
          statusCode: 500,
          message: "An error occured",
          postsError: new Error("oops")
        };
        // payload and expected state //
        const payload = { message: "Great Success!", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };

        const action = { type: DISLIKE_POST, payload: payload };
        const newState = postReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END DISLIKE_POST type //
    // REMOVE_POST_DISLIKE type //
    describe(`type: ${REMOVE_POST_DISLIKE}`, () => {
      it(`Should handle a ${REMOVE_POST_DISLIKE} case`, () => {
        const payload = { message: "Successs", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...initialPostsState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };
    
        const action = { type: REMOVE_POST_DISLIKE, payload: payload };
        const newState = postReducer(initialPostsState, action);
    
        expect(newState).toEqual(expectedState);
      });

      it(`Should set the {postsError} to NULL if present from previous action`, () => {
        // this is mock error state from presumed previous error //
        const errorState = {
          ...initialPostsState,
          statusCode: 500,
          message: "An error occured",
          postsError: new Error("oops")
        };
        // payload and expected state //
        const payload = { message: "Great Success!", posts: mockPosts, statusCode: 200 };
        const expectedState = {
          ...errorState,
          statusCode: payload.statusCode,
          message: payload.message,
          loading: false,
          posts: [...payload.posts],
          postsError: null
        };

        const action = { type: REMOVE_POST_DISLIKE, payload: payload };
        const newState = postReducer(errorState, action);

        expect(newState).toEqual(expectedState);
      });
    });
    // END REMOVE_POST_DISLIKE type //
  });
  // END Dislike, RemoveDislike {postReducer} actions //
});