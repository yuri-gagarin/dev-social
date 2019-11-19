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
  if(!userNav || !guestNav || !userNav.main || !guestNav.main) {
    const error = new Error("Can't get menu data");
    return {
      type: NAV_ERROR,
      payload: error,
    }
  }
  if(authState.userLoggedIn) {
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
  if (authState.userLoggedIn) {
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
/**
 * 
 * @param {Object} authState - Authorization state of the whole app.
 * @param {Object} dashData - Dashboard data.
 */
const openDash = (authState, dashData) => {
  let error, dashItems;
  if(!authState) {
    error = new Error("Authstate is not defined");
  };
  if(!dashData || !dashData.userDash) {
    error = new Error("Can't fetch the dashboard data");
  }
  
  if(authState.userLoggedIn) {
    dashItems = dashData.userDash;
  }
  //other cases for moderators? admins?
  else {
    dashItems = [];
  }

  if(!error) {
    return {
      type: OPEN_DASH,
      payload: dashItems,
    };
  }
  else {
    //error present
    return {
      type: NAV_ERROR,
      payload: error,
    };
  }
};

const closeDash = () => {
  return {
    type: CLOSE_DASH, 
    payload: [],
  }
};
export {openMain, closeMain, openInnerMain, closeInnerMain, openDash, closeDash};

