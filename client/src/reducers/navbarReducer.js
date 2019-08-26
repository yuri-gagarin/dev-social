import {OPEN_DASH, CLOSE_DASH} from "../actions/cases.js";

export default function(state={}, action) {
  switch(action.type) {
    case OPEN_DASH:
      return {
        ...state,
        dashOpen: true,
        dashData: action.payload.dashData,
      };
    case  CLOSE_DASH: 
      return {
        ...state, 
        dashOpen: false,
        dashData: null,
      }
    default: 
      return state;
  }
};
