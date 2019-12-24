// integration Like, RemoveLike, Dislike, RemoveDislike redux action tests with real server response //
import axios from "axios";
import store from "../../../src/redux/store";
import { fetchPosts } from "../../../src/redux/actions/postActions";
import * as actions from "../../../src/redux/actions/postLikeDislikeActions";

import { JWT_TOKEN } from "../../../src/helpers/constants/appConstants";
import { isError } from "../../../src/helpers/validators/dataValidators";

import faker from "faker";

describe("Post {Like} {Dislike} actions END - TO - END integration tests", () => {

  let token; // this will be the JWT token value 
  beforeAll(() => {
    axios.defaults.baseURL = "http://localhost:3000";
    const userCredentials = { email: "firstuser@mail.com", password: "Password1" };
    const options = {
      url: "/api/users/login",
      port: 3000,
      method: "post",
      data: {
        email: userCredentials.email,
        password: userCredentials.password
      },
    };
    return axios(options)
      .then((response) => {
        token = response.data.token;
      })
      .catch((error) => {
        console.log(error);
      });
  });
  afterAll(() => {

  });
  

  // User is NOT Logged In //
  describe("User is NOT logged in", () => {

    beforeAll(() => {
      return store.dispatch(fetchPosts());
    });
    beforeEach(() => {
      // set a wrong token //
      localStorage.setItem(JWT_TOKEN, "thisisnotavalidtoken");
    });
    afterEach(() => {
      localStorage.removeItem(JWT_TOKEN);
    });

    describe("Action: {likePost}", () => {
      it("Should respond with 401 response code and not allow operation", () => {
        const currentPosts = store.getState().postsState.posts;
        const postId = currentPosts[0]._id;

        return store.dispatch(actions.likePost(postId, currentPosts)).then(() => {
          const { statusCode, message, loading, posts, postsError } = store.getState().postsState;
          expect(statusCode).toBe(401);
          expect(typeof message).toEqual("string");
          expect(loading).toBe(false);
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });
      });
    });
    describe("Action: {removePostLike}", () => {
      it("Should respond with 401 response code and not allow operation", () => {
        const currentPosts = store.getState().postsState.posts;
        const postId = currentPosts[0]._id;

        return store.dispatch(actions.removePostLike(postId, currentPosts)).then(() => {
          const { statusCode, message, loading, posts, postsError } = store.getState().postsState;
          expect(statusCode).toBe(401);
          expect(typeof message).toEqual("string");
          expect(loading).toBe(false);
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });
      });
    });
    describe("Action: {dislikePost}", () => {
      it("Should respond with 401 response code and not allow operation", () => {
        const currentPosts = store.getState().postsState.posts;
        const postId = currentPosts[0]._id;

        return store.dispatch(actions.dislikePost(postId, currentPosts)).then(() => {
          const { statusCode, message, loading, posts, postsError } = store.getState().postsState;
          expect(statusCode).toBe(401);
          expect(typeof message).toEqual("string");
          expect(loading).toBe(false);
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });

      });
    });
    describe("Action: {removePostDislike}", () => {
      it("Should respond with 401 response code and not allow operation", () => {
        const currentPosts = store.getState().postsState.posts;
        const postId = currentPosts[0]._id;

        return store.dispatch(actions.removePostDislike(postId, currentPosts)).then(() => {
          const { statusCode, message, loading, posts, postsError } = store.getState().postsState;
          expect(statusCode).toBe(401);
          expect(typeof message).toEqual("string");
          expect(loading).toBe(false);
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });

      });
    });
  });
  // END User is NOT Logged In //

});