import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App.js";
import store from "./redux/store.js";
import "./styles.scss";
//import "semantic-ui-css/semantic.min.css";

import {BrowserRouter as Router} from "react-router-dom";

const testState = store.getState();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>, 
  document.getElementById("app")
);