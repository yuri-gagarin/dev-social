import { REGISTER, LOGIN, LOGOUT, LOGIN_SUCCESS, SET_USER } from "../cases";
import { isEmpty } from "../../helpers/validators/dataValidators";

const initialState = {
  userLoggedIn: false,
};

export default function(state=initialState, action) {
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
    case LOGIN_SUCCESS:
      return {
        ...state,
        userLoggedIn: true,
        user: action.payload,
      };
    
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
