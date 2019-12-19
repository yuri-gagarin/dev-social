// integration redux action tests with real server response //
import axios from "axios";
import store from "../../../src/redux/store";
import * as actions from "../../../src/redux/actions/postActions";
import { JWT_TOKEN } from "../../../src/helpers/constants/appConstants";


describe("postActions integration tests", () => {
  // User is Logged IN //
  describe("User IS logged in", () => {
    let posts = [], token;
    // login user - get JWT token //
    beforeAll(() => {
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
          localStorage.setItem(JWT_TOKEN, response.data.token);
          //console.log(localStorage.getItem(JWT_TOKEN));
        })
        .catch((error) => {
          console.log(error);
        })
    });
    // {createPost} Redux and API action //
    describe("Action {createPost}",  () => {
      it("Should create a Post, save to database and updated state", () => {
        //console.log(localStorage.getItem(JWT_TOKEN))
        return store.dispatch(actions.fetchPosts()).then(() => {
          console.log(store.getState().postsState);
        })
      });
    });
    // END {createPost} Redux and API action //
    // {saveEditedPost} Redux and API action //
    describe("Action {savedEditedPost}", () => {
      it("Should save an edited Post and update state", () => {

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