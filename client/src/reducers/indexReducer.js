import {combineReducers} from "redux";
import authReducer from "./authReducer.js";
import navbarReducer from "./navbarReducer.js";
import testReducer from "./testReducer.js";
import errorReducer from "./errorReducer.js";

export default combineReducers({
  auth: authReducer,
  nav: navbarReducer,
  test: testReducer,
  error: errorReducer
});


