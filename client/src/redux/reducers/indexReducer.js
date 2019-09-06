import {combineReducers} from "redux";
import authReducer from "./authReducer.js";
import {navReducer} from "./uiReducers";
import postReducer from "./postReducer.js";
import testReducer from "./testReducer.js";
import errorReducer from "./errorReducer.js";

export default combineReducers({
  auth: authReducer,
  nav: navReducer,
  posts: postReducer,
  test: testReducer,
  error: errorReducer
});


