//import {Provider} from "react-redux";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import store from "../src/redux/store";

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);


export default mockStore;