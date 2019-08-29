import {LIST_ERRORS} from "../cases.js";

export default function(state={}, action) {
  switch(action.type) {
    case LIST_ERRORS:
      return {
        ...state,
        statusCode: action.payload.status,
        statusText: action.payload.statusText,
        message: action.payload.message,
      }
    default: 
      return state;
  };


}