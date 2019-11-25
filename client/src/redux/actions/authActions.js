import axios from "axios";
import jwtDecode from "jwt-decode";
import {REGISTER, LIST_ERRORS, LOGIN, LOGIN_SUCCESS, LOGOUT, SET_USER} from "../cases.js";
import setAuthToken from "../../helpers/setAuthToken.js";

export const registerUserTest = (newUserData) => {

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

export const registerUser = (newUserData, history) => {
  return function(dispatch) {
    const config = {
      method: "POST",
      url: "/api/users/register",
      data: newUserData
    };
    axios(config)
      .then((response) => {
        history.push("/login");
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

export const loginUser = (userData, history) => {
  return function(dispatch) {
    const config = {
      method: "POST",
      url: "/api/users/login",
      data: userData,
    };
    axios(config)
      .then((response) => {
        const {token} = response.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decodedUserData = jwtDecode(token);
        history.push("/dashboard");
        dispatch({
          type: LOGIN,
          payload: {
            statusCode: response.status,
            message: response.data.message,
            data: decodedUserData,
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
  };
};

export const setUser = (userData) => {
  return function(dispatch) {
    if(!userData) {
      dispatch({
        type: SET_USER,
        payload: {
          message: "Welcome Guest",
          loggedIn: false,
        }
      });
    }
    else if (typeof userData === "string" && userData === "guest") {
      dispatch({
        type: SET_USER,
        payload: {
          message: "Welcome Guest",
          loggedIn: false,
        }
      });
    }
    else {
      dispatch({
        type: SET_USER,
        payload: {
          message: "User Logged In",
          loggedIn: true,
          data: userData,
        }
      });
    };
  }
};

export const logoutUser = (userData, history) => {
  console.log(146)
  console.log(userData)
  console.log(history)
  return function(dispatch) {
    delete localStorage.jwtToken;
    history.push("/");
    dispatch(({
      type: LOGOUT,
      payload: {
        message: `Bye ${userData.name}`,
        loggedIn: false,
      }
    }))
  }
};

export const userLoggedIn = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userData,
  };
}
