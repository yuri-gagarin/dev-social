// integration redux action tests with real server response //
import axios from "axios";
import store from "../../../src/redux/store";
import * as actions from "../../../src/redux/actions/postActions";
import { JWT_TOKEN } from "../../../src/helpers/constants/appConstants";
import { isError } from "../../../src/helpers/validators/dataValidators";

import faker from "faker";


describe("postActions integration tests", () => {
  let token; // this will be the JWT token value 
  beforeAll(() => {
    axios.defaults.baseURL = "http://localhost:3000";
    const userCredentials = { email: "firstuser@mail.com", password: "Password1" };
      //console.log(localhost);
      axios.defaults.baseURL = "http://localhost:3000";
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
          //console.log(localStorage.getItem(JWT_TOKEN));
        })
        .catch((error) => {
          console.log(error);
        })
  });
  

  // User is NOT Logged IN //
  describe("User is NOT logged in", () => {

    beforeEach(() => {
      // set a wrong token
      localStorage.setItem(JWT_TOKEN, "thisisnotavalidtoken");
    })
    afterEach(() => {
      localStorage.removeItem(JWT_TOKEN);
    })
   

    describe("Action {fetchPosts}", () => {
      it("Should fetch posts and correctly set the {postsState}", () => {
        return store.dispatch(actions.fetchPosts()).then(() => {
          const { loading, message, posts, postsError } = store.getState().postsState;
          expect(loading).toBe(false);
          expect(typeof message).toEqual("string");
          expect(Array.isArray(posts)).toBe(true);
          expect(postsError).toBe(null);
        });
      });     
    });

    describe("Action {createPost}", () => {
      it("Should reject with an error and set appropriate {postsState}", () => {
        const post = { title: "title", text: "text" }
        const currentPosts = store.getState().postsState.posts;

        return store.dispatch(actions.createPost(post, currentPosts)).then(() => {
          const { loading, message, posts, postsError} = store.getState().postsState;
          expect(loading).toBe(false);
          expect(typeof message).toEqual("string");
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });
      });
    });

    describe("Action {saveEditedPost}", () => {
      it("Should reject with an error and set appropriate {postsState}", () => {
        const currentPosts = store.getState().postsState.posts;
        const editedPost = {
          ...currentPosts[0],
          title: "I changed it"
        };

        return store.dispatch(actions.saveEditedPost(editedPost, currentPosts)).then(() => {
          const { loading, message, posts, postsError} = store.getState().postsState;
          expect(loading).toBe(false);
          expect(typeof message).toEqual("string");
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });
      });
    });

    describe("Action {deletePost}", () => {
      const currentPosts = store.getState().postsState.posts;
      const postToDelete = {
        ...currentPosts[0]
      };
      const postId = postToDelete._id;

      it("Should reject with an error and set appropriate {postsState}", () => {
        return store.dispatch(actions.deletePost(postId)).then(() => {
          const { loading, message, posts, postsError} = store.getState().postsState;
          expect(loading).toBe(false);
          expect(typeof message).toEqual("string");
          expect(Array.isArray(posts)).toBe(true);
          expect(isError(postsError)).toBe(true);
        });
      });
    });

  });
  // END User is NOT Logged IN //
  // User is Logged IN //
  describe("User IS logged in", () => {
    // login user - get JWT token //
    beforeAll(() => {
      localStorage.setItem(JWT_TOKEN, token);
    }); 
    // {createPost} Redux and API action //
    describe("Action {createPost}",  () => {
      it("Should create a Post, save to database and updated state", () => {
        const currentPosts = store.getState().postsState.posts; 
        const postData = { title: "A new post", text: faker.lorem.paragraph(2) };
        return store.dispatch(actions.createPost(postData, currentPosts)).then(() => {
          const { loading, message, posts, postsError } = store.getState().postsState;
          expect(loading).toBe(false);
          expect(typeof message).toEqual("string");
          expect(posts.length).toEqual(currentPosts.length + 1);
          expect(postsError).toBe(null);
        });
      });
    });
    // END {createPost} Redux and API action //
    // {saveEditedPost} Redux and API action //
    describe("Action {savedEditedPost}", () => {
      it("Should save an edited Post and update state", () => {
        const currentPosts = store.getState().postsState.posts;
        const updatedPost = { 
          ...currentPosts[currentPosts.length - 1],
          title: "I am updated"
        };

       return store.dispatch(actions.saveEditedPost(updatedPost, currentPosts)).then(() => {
         const { loading, message, posts, postsError } = store.getState().postsState;
         const updatedPostTitle = posts[posts.length - 1].title;
         expect(loading).toBe(false);
         expect(typeof message).toEqual("string");
         expect(posts.length).toEqual(currentPosts.length);
         expect(updatedPostTitle).toEqual(updatedPost.title);
         expect(postsError).toBe(null);
       });

      });
    });
    // END {saveEditedPost} Redux and API action //
    // {deletePost} Redux and API action //
    describe("Action {deletePost}", () => {
      it("Should delete a specific post and update state", () => {

      });
    });
    // END {deletePost} Redux and API action //
  });
  // END user is logged in 
})