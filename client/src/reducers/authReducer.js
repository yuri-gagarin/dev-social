import {REGISTER, LOGIN, LOGOUT} from "../actions/cases.js";
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
        message: action.payload.data.message,
        loggedIn: true,
        user: action.payload.data.user,
      });
    case LOGOUT:
      return ({
        result: action.payload
      })
    default:
      return state;
  }
};
