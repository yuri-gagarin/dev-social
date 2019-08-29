import {OPEN_MAIN, CLOSE_MAIN, OPEN_INNER_MAIN, CLOSE_INNER_MAIN, OPEN_DASH, CLOSE_DASH} from "../cases.js";
import {guestNav, userNav} from "../../components/navbar/nav_data/navData.js";



const openMain = (authState) => {
  let mainData;
  if(authState.loggedIn) {
    mainData = userNav.main.data;
  }
  else {
    mainData = guestNav.main.data;
  }
  return function(dispatch) {
    dispatch({
      type: OPEN_MAIN,
      payload: mainData,
    });
  };
};
const closeMain = () => {
  return function(dispatch) {
    dispatch({
      type: CLOSE_MAIN,
      payload: null,
    })
  };
};
const openInnerMain = (authState, content) => {
  let innerMainData;
  if (authState.loggedIn) {
    innerMainData = userNav.innerMain[content];
  }
  else {
    innerMainData = guestNav.innerMain[content];
  }
  return function(dispatch) {
    dispatch({
      type: OPEN_INNER_MAIN,
      payload: innerMainData,
    });
  };
};
const closeInnerMain = () => {
  return function(dispatch) {
    dispatch({
      type: CLOSE_INNER_MAIN,
      payload: null, 
    });
  };
};
const openDash = (authState) => {
  return function(dispatch) {
    //should come from the server depending on user type
    //api call?
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

const closeDash = () => {
  return {
    type: CLOSE_DASH, 
    payload: null,
  }
};
export {openMain, closeMain, openInnerMain, closeInnerMain, openDash, closeDash};

