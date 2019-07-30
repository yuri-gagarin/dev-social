import axios from "axios";

export const test = () => dispatch => {
  setTimeout(function() {
    dispatch({
      type: "TEST",
      payload: "Now Tested"
    });
  }, 1000);
};

export const cancelTest = () => {
  return {
    type: "CANCEL_TEST",
    payload: "Cancelld the test"
  };
};


