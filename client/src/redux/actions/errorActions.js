import {CLEAR_ERRORS} from "../cases.js";

export const clearErrors = () => {
  return function(dispatch) {
    dispatch({
      type: CLEAR_ERRORS,
      payload: null,
    });
  };
};
