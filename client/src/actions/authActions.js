import axios from "axios";
import qs from "qs";
import {REGISTER, LIST_ERRORS, LOGIN, LOGOUT} from "../actions/cases.js";

export const registerUserTest = (newUserData) => {
  console.log(newUserData);

  return function(dispatch) {
    const config = {
      method: "POST",
      url: "/api/users/register_test",
      data: newUserData
      //data: qs.stringify(data)
    };
    axios(config)
      .then((response) => {
        console.log(response);
        dispatch({
          type: REGISTER,
          payload: response
        });
      })
      .catch((error) => {
        console.log("error");
        console.log(error.response);
        dispatch({
          type: LIST_ERRORS,
          payload: {
            statusCode: error.response.status,
            data: error.response.data
          }
        });
      });
  }
};

export const registerUser = (newUserData) => {
  return function(dispatch) {
    const config = {
      method: "POST",
      url: "/api/users/register",
      data: newUserData
    };
    axios(config)
      .then((response) => {
        dispatch({
          type: REGISTER,
          payload:  {
            status: response.status,
            data: response.data
          }
        });
      })
      .catch((error) => {
        dispatch({
          type: LIST_ERRORS,
          payload: {
            statusCode: error.response.status,
            data: error.response.data
          }
        });
      });
  }
};
