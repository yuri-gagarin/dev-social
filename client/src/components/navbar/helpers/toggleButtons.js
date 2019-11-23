import * as navActions from "../../../redux/actions/navActions";
import store from "../../../redux/store";
import { fetchData } from "../../../redux/actions/appAction";

import {guestNav, userNav} from "../nav_data/navData";


/**
 * Closes sidebar main menu.
 * @param {Object} e - javascript event object.
 * @returns null.
 */
export const closeMain = (e={}) => {
  const {authState, navState} = store.getState();
  if(navState.innerMainVisible) {
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
export const openMain = (e={}) => {
  const {authState} = store.getState();
  if(!authState) {
    return false;
  }
  store.dispatch(navActions.openMain(authState, {guestNav, userNav}));
}
/**
 * Opens sidebar inner main menu.
 * @param {Object} event - javascript event object.
 * @returns null.
 */
export const openInnerMain = (e={}) => {
  e.stopPropagation();
  const targetOpen = e.target.getAttribute("data-value");
  const {authState} = store.getState();
  if(!targetOpen) {
    return false; 
  }
  else {
    store.dispatch(navActions.openInnerMain(authState, {guestNav, userNav} ,targetOpen));
  }
};
export const closeInnerMain = () => {
  store.dispatch(navActions.closeInnerMain());
};
export const handleInnerClick = (event, history) => {
  if(!event || !history) {
    return false;
  }
  const clickableTarget = event.target.getAttribute("data-value");
  if(!clickableTarget) {
    return false;
  }
  [model, filter] = clickableTarget.split("-");
  const url = `/api/${model}`;
  const fetchOptions = {
    method: "GET",
    url: url,
    params: {
      filter: filter,
    }
  };

  closeMain();
  fetchData(fetchOptions);
  history.push(fetchOptions);
};


