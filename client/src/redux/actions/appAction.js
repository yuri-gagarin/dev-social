import axios from "axios";
import {LIST_ERRORS} from "../cases.js";

export const test = () => {
  return (dispatch) => {
    setTimeout(function() {
      dispatch({
        type: "TEST",
        payload: "Now Tested"
      });
    }, 1000);
  };
};

export const cancelTest = () => {
  return (dispatch) => {
    setTimeout(function() {
      dispatch({
        type: "CANCEL_TEST",
        payload: "Now Test Cancelled"
      });
    }, 1000);
  };
};

export const fetchData = (route) => {
  return function(dispatch) {
    if (typeof route !== "string") {
      const error = {
        status: 400,
        statusText: "Invalid Client Input",
        message: "If this error persists please send our team a message",
      }
      dispatch({
        type: LIST_ERRORS,
        payload: error,
      })
    }
    console.log(route);
    dispatch({
      type: FETCH_DATA,
      payload: "Bullshit",
    })
  }
} 
