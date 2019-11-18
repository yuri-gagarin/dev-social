//import {Provider} from "react-redux";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);
const store = mockStore({
  authState: {
    loggedIn: false,
  },  
  navState: {
    mainItems: [{name: "a", key: 1}, {name: "b", key: 2}],
  },
  postState: {},
});

export default store;