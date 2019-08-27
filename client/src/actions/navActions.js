import {OPEN_DASH, CLOSE_DASH} from "./cases.js";

export const openDashboard = () => {
  return function(dispatch) {
    //should come from the server depending on user type
    //api call
    const dashData = {
      user: "user",
      type: "admin",
      options: {

      }
    };

    dispatch({
      type: OPEN_DASH,
      payload: dashData,
    })
  }
};

export const closeDashboard = () => {
  return {
    type: CLOSE_DASH, 
    payload: null,
  }
};

