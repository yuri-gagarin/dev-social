import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import indexReducer from "./reducers/indexReducer.js";

const middleware = [thunk];
const initialState = {};

export default createStore(
    indexReducer, initialState, compose(applyMiddleware(...middleware), 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

