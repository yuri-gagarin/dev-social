import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App.js";
import store from "./store.js";
import "./styles.scss";

import jwtDecode from "jwt-decode";
import {setUser, logoutUser} from "./actions/authActions.js";
import setAuthToken from "./helpers/setAuthToken.js";

//check for a user login
if(localStorage.jwtToken) {
  console.log("here");
  const currentUser = jwtDecode(localStorage.jwtToken)
  const timeNow = Date.now();
  console.log(16)
  console.log(currentUser.exp)
  console.log(timeNow)
  if(currentUser.exp > timeNow) {
    delete localStorage.jwtToken;
    store.dispatch(logoutUser(currentUser));
  }
  else {
    setAuthToken(localStorage.jwtToken);
    console.log(currentUser);
    store.dispatch(setUser(currentUser));
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById("app")
);