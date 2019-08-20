import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App.js";
import store from "./store.js";
import "./styles.scss";

import jwtDecode from "jwt-decode";
import {setUser} from "./actions/authActions.js";
import setAuthToken from "./helpers/setAuthToken.js";

if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const currentUser = jwtDecode(localStorage.jwtToken)
  store.dispatch(setUser(currentUser));
}
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById("app")
);