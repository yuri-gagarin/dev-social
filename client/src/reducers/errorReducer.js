import {LIST_ERRORS} from "../actions/cases.js";
const initialState = {errors: "none"};

export default function(state = initialState, action) {
  switch(action.type) {
    case LIST_ERRORS:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        message: action.payload.data.message,
        errors: action.payload.data.errors
      }
    default: 
      return state;
  };


}