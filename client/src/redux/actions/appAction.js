import axios from "axios";

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
