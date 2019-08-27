import {OPEN_DASH, CLOSE_DASH} from "../actions/cases.js";

const initialState = {
  navBar: {
    pusherVisible: false,
    mainVisible: false,
    innerMainVisible: false,
    dashOpen: false,
  },
};

export const  navReducer = (state=initialState, action) =>{
  switch(action.type) {
    case OPEN_MAIN:
      return {
        ...state,
        navBar: {
          ...state.navBar,
          mainVisible: true,
        }
      };
    case CLOSE_MAIN:
      return {
        ...state,
        navBar: {
          ...state.navBar,
          mainVisible: false,
        }
      };
    case OPEN_INNER_MAIN: 
      return {
        ...state,
        navBar: {
          ...state.navBar,
          innerMainVisible: true,
        }
      };
    case CLOSE_INNER_MAIN: 
      return {
        ...state,
        navBar: {
          ...state.navBar,
          innerMainVisible: false,
        }
      };
    case OPEN_DASH:
      return {
        ...state,
        navBar: {
          ...state.navBar,
          dashOpen: true,
        }
      };
    case  CLOSE_DASH: 
      return {
        ...state, 
        navBar: {
          ...state.navBar,
          dashOpen: false,
        }
      };
    default: 
      return state;
  };
};
