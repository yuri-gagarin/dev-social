import {combineReducers} from "redux";
import loginReducer from "./loginReducer.js";
import testReducer from "./testReducer.js";

export default combineReducers({
  login: loginReducer,
  test: testReducer
});


