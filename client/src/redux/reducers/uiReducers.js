import {OPEN_MAIN, CLOSE_MAIN, OPEN_INNER_MAIN, CLOSE_INNER_MAIN, OPEN_DASH, CLOSE_DASH} from "../cases.js";

const initialState = {
  navBar: {
    pusherVisible: false,
    mainVisible: false,
    innerMainVisible: false,
    dashOpen: false,
    mainItems: [],
    innerMainItems: [],
  },
};

export const navReducer = (state=initialState.navBar, action) =>{
  switch(action.type) {
    case OPEN_MAIN:
      return {
        ...state,
        mainVisible: true,
        mainItems: [...action.payload],
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
          innerMainData: [...action.payload.innerMainData],
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
          dashData: [],
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
