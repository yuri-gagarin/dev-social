import {combineReducers} from "redux";
import authReducer from "./authReducer";
import commentsReducer from "./commentsReducer";
import {navReducer} from "./uiReducers";
import postReducer from "./postReducer";
import testReducer from "./testReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  authState: authReducer,
  commentsState: commentsReducer,
  navState: navReducer,
  postsState: postReducer,
  test: testReducer,
  error: errorReducer
});


