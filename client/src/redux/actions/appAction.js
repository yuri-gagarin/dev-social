import axios from "axios";
import pluralize from "pluralize";

import {LIST_ERRORS, MODEL_ERROR, FETCH_DATA, FETCH_POSTS} from "../cases.js";
import isEmpty from "../../../../helpers/validators/isEmpty.js";

/**
 * Capitalizes a string. 
 * @throws {TypeError} Throws a  TypeError if argument is not a string.
 * @param {String} string A string to be capitalized.
 * @returns {String} A capitalized String.
 */
const capitalize = (string) => {
  if (typeof string !== "string") {
    throw new TypeError("Expected fist argument to be a {String}");
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const getModelAction = (dataModel) => {
  switch (dataModel) {
    case "posts":
      return FETCH_POSTS;
    default:
      return MODEL_ERROR;
  }
};

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

export const fetchData = (options) => {
  const dataModel = options.model;
  const modelName = dataModel ? capitalize(pluralize.singular(dataModel)) : null;
  const dispatchType = getModelAction(modelName);

  return function(dispatch) {
    const error = {};
    if (typeof options !== "object") {
      error.status = 400;
      error.statusText = "Invalid Client Input";
      error.message = "If this error persists please send our team a message";
    }
    if (dispatchType === MODEL_ERROR) {
      error.status = 400;
      error.statusText = "Invalid Input";
      error.message = "Cannot resolve database";
    }
    if(!isEmpty(error)) {
      dispatch({
        type: LIST_ERRORS,
        payload: error,
      })
    }
    else {
      axios({
        method: "get",
        url: options.appRoute,
      })
        .then((response) => {
          const data = response[dataModel];
          console.log(data)
          dispatch({
            type: dispatchType,
            payload: data,
          })
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
} 
