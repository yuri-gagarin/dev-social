import {combineReducers} from "redux";
import authReducer from "./authReducer.js";
import testReducer from "./testReducer.js";
import errorReducer from "./errorReducer.js";

export default combineReducers({
  auth: authReducer,
  test: testReducer,
  error: errorReducer
});


