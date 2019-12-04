import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../../src/redux/actions/postActions";
import {likePost, dislikePost, removePostLike, removePostDislike} from "../../src/redux/actions/postLikeDislikeActions";
import * as types from "../../src/redux/cases";
import store from "../../src/redux/store";

import {JWT_TOKEN} from "../../src/helpers/constants/appConstants";
import { loginError } from "../../src/helpers/commonErrors";

import moxios from "moxios";
import {generatePost} from "../helpers/mockData";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const testStore = mockStore(store.getState());

const posts = [];
for (let i = 0; i < 10; i++) {
  posts.push(generatePost({postId: i, userId: i}));
}
//throw in some post navbar tests here
describe("Post Actions Tests", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
    testStore.clearActions();
  });
  describe("Post fetch tests", () => {
    it("successfuly fetches some posts", () => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            message: "success",
            posts: posts,
          }
        });
      });
  
      const expectedActions = [
        {type: types.POSTS_REQUEST, payload: {loading: true}},
        {type: types.POSTS_SUCCESS, payload: {message: "success", posts: posts, loading: false}},
      ];  
      return testStore.dispatch(actions.fetchPosts())
        .then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
    });

    it("throws an error when the request fails", () => {

      const API_Error = new Error("Something went wrong");
      const errorResponse = {
        message: API_Error.message,
        error: API_Error,
        loading: false,
      };
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.reject(API_Error)
      });
      const {payload} = actions.postsRequest();
  
      const expectedActions = [
        {type: types.POSTS_REQUEST, payload: payload},
        {type: types.POSTS_ERROR, payload: errorResponse},
      ];
      return testStore.dispatch(actions.fetchPosts())
        .then(() => {
          expect(testStore.getActions()).toEqual(expectedActions);
        });
    });
  });

  
  // 
  describe("Post {Like} {Dislike} toggles tests", () => {
    beforeAll(() => {
      //localStorage mock token
      localStorage.setItem(JWT_TOKEN,  "a_fake_token")
    })
    describe(`Action: {likePost}`, () => {
      it(`Should dispatch a ${types.LIKE_POST} action`, () => {
        // a liked post for mock API call return
        const updatedPost = {...posts[0]};
        updatedPost.likeCount +=1;
        updatedPost.markLiked = true;
        // the shape of new postState with the first post liked.
        const newPostsState = [...posts];
        newPostsState[0] = {...updatedPost};
  
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
        const postId = posts[0]._id;
        return testStore.dispatch(likePost(postId, posts))
          .then(() => {
            //console.log(testStore.getActions())
            //console.log(expectedActions)
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      });
      it(`Should successfully handle an error`, () => {
        const error = new Error("Oops");
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error, loading: false} }
        ];
        return testStore.dispatch(likePost(123, posts))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      })
    })
    describe("Action: {removePostLike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_POST_LIKE} action`, () => {
        //in the mock state the post is liked
        const likedPost = {...posts[0]};
        likedPost.likeCount = 1;
        likedPost.markLiked = true;
        const currentPostState = posts.slice(1)
        currentPostState.unshift(likedPost);
        //expected that all posts will have no user like
        const updatedPost = {...posts[0]}
        updatedPost.likeCount -= 1;
        updatedPost.markLiked = false;
        const expectedPostState = posts.slice(1);
        expectedPostState.unshift(updatedPost);
  
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
          { type: types.REMOVE_POST_LIKE, payload: {message: "unlike post", posts: expectedPostState} }
        ];
        const postId = updatedPost._id;
        return testStore.dispatch(removePostLike(postId, currentPostState))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      });
      it(`Should successfully handle an error`, () => {
        const error = new Error("Oops");
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error, loading: false} }
        ];
        return testStore.dispatch(removePostLike(123, posts))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      })
    });
    describe("Action: {dislikePost}", () => {
      it(`Should successfully dispatch a ${types.DISLIKE_POST} action`, () => {
        const updatedPost = {...posts[1]};
        updatedPost.dislikeCount +=1;
        updatedPost.markDisliked = true;
        //
        const newPostsState = [...posts];
        newPostsState[1] = {...updatedPost};
        //console.log(newPostsState)
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
        const postId = updatedPost._id;
        const expectedActions = [
          { type: types.DISLIKE_POST, payload: {message: "disliked post", posts: newPostsState} }
        ];
        return testStore.dispatch(dislikePost(postId, posts))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      });
      it(`Should successfully handle an error`, () => {
        const error = new Error("Oops");
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error, loading: false} }
        ];
        return testStore.dispatch(dislikePost(123, posts))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      })
    });
    
    describe("Action: {removePostDislike}", () => {
      it(`Should successfully dispatch a ${types.REMOVE_POST_DISLIKE} action`, () => {
        //current posts state
        const currentPostsState = posts.slice();
        currentPostsState[0].markDisliked = true;
        currentPostsState[0].dislikeCount = 1;
        const postId = currentPostsState[0]._id
        //updated post
        const updatedPost = {
          ...currentPostsState[0],
          markDisliked: false,
          dislikeCount: currentPostsState[0].dislikeCount - 1,
        };
        //expected post state
        const expectedPostState = posts.slice(1);
        expectedPostState.unshift(updatedPost);

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
          { type: types.REMOVE_POST_DISLIKE, payload: {message: "disliked", posts: expectedPostState} }
        ];
        return testStore.dispatch(removePostDislike(postId, currentPostsState))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      });
      it(`Should successfully handle an API error`, () => {
        const error = new Error("Oops");
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject({
            status: 400,
            response: error
          });
        });
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: error.message, error: error, loading: false} }
        ];
        return testStore.dispatch(removePostDislike(123, posts))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          });
      });
      it("Should throw an error if no token is in {localStorage}", () => {
        localStorage.setItem(JWT_TOKEN, null);
        const expectedActions = [
          { type: types.POSTS_ERROR, payload: {message: loginError.message, error: loginError} }
        ];

        return testStore.dispatch(removePostDislike(123, posts))
          .then(() => {
            expect(testStore.getActions()).toEqual(expectedActions);
          })
      })
    });
    
  })
});

