import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import indexReducer from "./reducers/indexReducer.js";

export default function configureStore() {
  return createStore(
    indexReducer, applyMiddleware(thunk)
  )
};

