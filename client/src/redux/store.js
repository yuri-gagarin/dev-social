import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import indexReducer from "./reducers/indexReducer.js";

const middleware = [thunk];

const composeEnhancers = process.env === "development" 
    ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    : compose;

export default createStore(
    indexReducer, compose(applyMiddleware(...middleware), composeEnhancers)
);

