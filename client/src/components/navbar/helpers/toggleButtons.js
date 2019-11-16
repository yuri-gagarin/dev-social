import * as navActions from "../../../redux/actions/navActions";
import store from "../../../redux/store";


const buttonConstants = {
  OPEN_MAIN: "open-main",
  CLOSE_MAIN: "close-main",
  OPEN_INNER_MAIN: "open-inner-main",
  CLOSE_INNER_MAIN: "close-inner-main",
}

/**
 * Closes sidebar main menu.
 * @param {Object} e - javascript event object.
 * @returns null.
 */
export const closeMain = (e) => {
  //const {authState, navState} = store.getState();
  if(nav.innerMainVisible) {
    setTimeout(() => {
      store.dispatch(navActions.closeInnerMain());
    }, 500);
    store.dispatch(navActions.closeMain());
  }
  else {
    store.dispatch(navActions.closeMain());
  }
};
/**
 * Opens sidebar main menu.
 * @param {Object} e - javascript event object.
 * @returns null.
 */
export const openMain = (e) => {
  const {authState} = store.getState();
  if(!authState.loggedIn) {
    return false;
  }
  store.dispatch(navActions.openMain(authState))
}
/**
 * Openssidebar inner main menu.
 * @param {Object} event - javascript event object.
 * @returns null.
 */
export const openInnerMain = (e) => {
  e.stopPropagation();
  const targetOpen = e.target.getAttribute("data-inner");
  if(!targetOpen) {
    return false; 
  }
  else {
    store.dispatch(navActions.openInnerMain(authState, targetOpen));
  }
};

