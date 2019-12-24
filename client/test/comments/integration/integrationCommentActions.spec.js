// integration redux action test with a real server response and redux state //
import axios from "axios";
import store from "../../../src/redux/store";
import * as actions from "../../../src/redux/actions/commentActions";

import { JWT_TOKEN } from  "../../../src/helpers/constants/appConstants";
import { isError } from "../../../src/helpers/validators/dataValidators";

import faker from "faker";

describe("commentActions integration tests", () => {
  let token; // this will be the JWT token value
  // login user and set the token before tests //
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
      }
    };
    return axios(options) 
      .then((response) => {
        token = response.data.token;
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // User is NOT Logged IN //
  describe("User is NOT logged in", () => {
    // pre test setup //
    beforeEach(() => {
      // set a wrong token //
      localStorage.setItem(JWT_TOKEN, "notavalidtoken");
    });
    afterEach(() => {
      localStorage.removeItem(JWT_TOKEN);
    });

    describe("Action {fetchComments}", () => {
      it("Should fetch comments and correctly set the {commentsState}", () => {
        return store.dispatch(actions.fetchComments()).then(() => {
          const { statusCode, message, loading, comments, commentsError } = store.getState().postsState;
  
          expect(statusCode).toBe(200);
          expect(typeof message).toEqual("string");
          expect(loading).toBe(false);
          expect(Array.isArray(comments)).toBe(true);
          expect(commentsError).toBe(null)
        });
      });
    });
  });
  // END User is NOT logged in //

  

});