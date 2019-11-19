//import {Provider} from "react-redux";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);


export default mockStore;