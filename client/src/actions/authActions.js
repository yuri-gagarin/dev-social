import axios from "axios";
import {REGISTER, LIST_ERRORS, LOGIN, LOGOUT} from "../actions/cases.js";

export const registerUserTest = (newUserData) => {
  console.log(newUserData);

  return function(dispatch) {
    const config = {
      method: "POST",
      url: "/api/users/register_test",
      data: newUserData
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
  };
};

export const loginUser = (clientData, history) => {
  console.log(history);
  return function(dispatch) {
    const config = {
      method: "POST",
      url: "/api/users/login",
      data: clientData,
    };
    axios(config)
      .then((response) => {
        history.push("/dashboard");
        dispatch({
          type: LOGIN,
          payload: {
            statusCode: response.status,
            data: response.data,
          }
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: LIST_ERRORS,
            payload: {
              message: error.response.data.message,
              statusText: error.response.statusText,
              status: error.response.status,
            }
          });
        }
        else {
          dispatch({
            type: LIST_ERRORS,
            payload: {
              message: error.message
            }
          });
        }
      });
  }
}