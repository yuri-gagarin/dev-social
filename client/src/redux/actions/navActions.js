import {OPEN_MAIN, CLOSE_MAIN, OPEN_INNER_MAIN, CLOSE_INNER_MAIN, OPEN_DASH, CLOSE_DASH, NAV_ERROR} from "../cases.js";

//main menu actions//
/**
 * Dispatches the open main menu sidebar action.
 * @param {Object} authState - The authState redux store object.
 * @param {Object} navData - The navigation data to fill out menubar.
 * @param {Object} navData.guestNav - Guest navBar for guest users. 
 * @param {Object} navData.userNav - Logged in user navbar.
 */
const openMain = (authState={}, navData={}) => {
  let mainData;
  let {userNav, guestNav} = navData;
  //possible errors
  if(!authState) {
    const error = new TypeError("AuthState is undefined");
    return {
      type: NAV_ERROR,
      payload: error,
    };
  }
  if(!userNav || !guestNav || !userNav.main || !guestNav.main) {
    const error = new Error("Cant get menu data");
    return {
      type: NAV_ERROR,
      payload: error,
    }
  }
  if(authState.loggedIn) {
    mainData = userNav.main.data;
  }
  else {
    mainData = guestNav.main.data;
  }
  return {
      type: OPEN_MAIN,
      payload: mainData || [],
  };
};
const closeMain = () => {
  return {
    type: CLOSE_MAIN,
    payload: [],
  };
};
//inner main menu sidebars
/**
 * Dispatches the open main menu sidebar action.
 * @param {Object} authState - The authState redux store object.
 * @param {Object} navData - The navigation data to fill out menubar.
 * @param {Object} navData.guestNav - Guest navBar for guest users. 
 * @param {Object} navData.userNav - Logged in user navbar.
 * @param {string} target - The target value passed from click function.
 */
const openInnerMain = (authState={}, navData={}, target) => {
  let innerMainData;
  let {userNav, guestNav} = navData;
  //possible errors
  if(!authState) {
    const error = new TypeError("AuthState is undefined");
    return {
      type: NAV_ERROR,
      payload: error,
    };
  }
  if(!userNav || !guestNav || !userNav.innerMain || !guestNav.innerMain) {
    const error = new Error("Can't get menu data");
    return {
      type: NAV_ERROR,
      payload: error,
    };
  }
  if(!target || typeof target !== "string") {
    const error = new Error("Can't resolve user input menu data");
    return {
      type: NAV_ERROR,
      payload: error, 
    };
  }
  if (authState.loggedIn) {
    innerMainData = userNav.innerMain[target];
  }
  else {
    innerMainData = guestNav.innerMain[target];
  }
  return {
    type: OPEN_INNER_MAIN,
    payload: innerMainData || [],
  };
};
const closeInnerMain = () => {
  return {
    type: CLOSE_INNER_MAIN,
    payload: [], 
  };
};
//dashboard
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

