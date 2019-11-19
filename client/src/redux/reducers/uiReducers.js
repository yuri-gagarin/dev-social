import {OPEN_MAIN, CLOSE_MAIN, OPEN_INNER_MAIN, CLOSE_INNER_MAIN, OPEN_DASH, CLOSE_DASH, NAV_ERROR} from "../cases.js";

const navState = {
  pusherVisible: false,
  mainVisible: false,
  innerMainVisible: false,
  dashOpen: false,
  mainItems: [],
  innerMainItems: [],
  dashItems: [],
};

export const navReducer = (state=navState, action) =>{
  switch(action.type) {
    case OPEN_MAIN:
      return {
        ...state,
       mainVisible: true,
       pusherVisible: true,
       mainItems: [...action.payload],
       navError: null,
      };
    case CLOSE_MAIN:
      return {
        ...state,
        pusherVisible: false,
        mainVisible: false,
        navError: null,
      };
    case OPEN_INNER_MAIN: 
      return {
        ...state,
        pusherVisible: true,
        mainVisible: true,
        innerMainVisible: true,
        innerMainItems: [...action.payload],
        navError: null,
      };
    case CLOSE_INNER_MAIN: 
      return {
        ...state,
        innerMainVisible: false,
        innerMainItems: [...action.payload],
        navError: null,
      };
    case OPEN_DASH:
      return {
        ...state,
        pusherVisible: true,
        dashOpen: true,
        dashItems: [...action.payload],
        navError: null,
      };
    case  CLOSE_DASH: 
      return {
        ...state,
        pusherVisible: false,
        dashOpen: false,
        dashItems: [...action.payload],
        navError: null,
      };
    case NAV_ERROR:
      return {
        ...state,
        navError: {
          error: action.payload,
          errorMessage: action.payload.message,
        }
      };
    default: 
      return state;
  };
};
