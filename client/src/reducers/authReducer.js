import {REGISTER, LOGIN, LOGOUT} from "../actions/cases.js";
const initialState = {
  name: null,
  lastName: null,
  email: null
};
export default function(state=initialState, action) {
  switch(action.type){
    case REGISTER:
      return ({
        ...state,
        statusCode: action.payload.statusCode,
        message: action.payload.data.message,
        user: action.payload.data.user
      });
    case LOGIN:
      return ({
        result: action.payload
      });
    case LOGOUT:
      return ({
        result: action.payload
      })
    default:
      return state;
  }
};
