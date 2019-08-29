import {REGISTER, LOGIN, LOGOUT, SET_USER} from "../cases.js";
import isEmpty from "../../helpers/validators/isEmpty.js";

export default function(state={}, action) {
  switch(action.type){
    case REGISTER:
      return ({
        ...state,
        message: action.payload.data.message,
        isRegistered: true,
        user: action.payload.data.user,
      });
    case LOGIN:
      return ({
        ...state,
        message: action.payload.message,
        loggedIn: !isEmpty(action.payload.data),
        user: action.payload.data,
      });
    case SET_USER: 
      return({
        ...state,
        message: action.payload.message,
        loggedIn: !isEmpty(action.payload.data),
        user: action.payload.data,
      });
    case LOGOUT:
      return ({
        ...state,
        message: action.payload.message,
        loggedIn: action.payload.loggedIn,
        user: null,
      });
    default:
      return state;
  }
};
