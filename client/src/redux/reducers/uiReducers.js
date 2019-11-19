import {OPEN_MAIN, CLOSE_MAIN, OPEN_INNER_MAIN, CLOSE_INNER_MAIN, OPEN_DASH, CLOSE_DASH} from "../cases.js";

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
      };
    case CLOSE_MAIN:
      return {
        ...state,
        pusherVisible: false,
        mainVisible: false,
      };
    case OPEN_INNER_MAIN: 
      return {
        ...state,
        pusherVisible: true,
        mainVisible: true,
        innerMainVisible: true,
        innerMainItems: [...action.payload],
      };
    case CLOSE_INNER_MAIN: 
      return {
        ...state,
        innerMainVisible: false,
        innerMainItems: [...action.payload],
      };
    case OPEN_DASH:
      return {
        ...state,
        dashOpen: true,
        dashItems: [...action.payload],
      };
    case  CLOSE_DASH: 
      return {
        ...state,
        dashOpen: false,
      };
    default: 
      return state;
  };
};
