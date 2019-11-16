import React from "react";
import {shallow} from "enzyme";
import MainMenu from "../../src/components/navbar/nav_components/MainMenu";
import {Provider} from "react-redux";

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

describe("Main Menu sidebar test", () => {
  const props = {
    authState: {...store.authState},
    navState: {...store.navState},
  };

  it("should render", () => {
    const wrapper = mount(<Provider store={store}><MainMenu {...props} /></Provider>);
    expect(wrapper).toBeDefined();
  });
  describe("Close main menu item", () => {
    it("Should have a a close menu clickable item", () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const mainMenuClose = wrapper.find(`[data-test="main-menu-close"]`);
      expect(mainMenuClose.html()).toBeDefined();
    });
    it("Should have a onClick prop function", () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const mainMenuClose = wrapper.find(`[data-test="main-menu-close"]`);
      expect(typeof mainMenuClose.props().onClick).toEqual('function');
    })
  });
  describe("Main menu clickable items", () => {
    it("Should have equal items to {navState.mainItem}", () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const clickableItems = wrapper.find(`[data-test="main-menu-clickable"]`);
      expect(clickableItems.length).toEqual(props.authState.mainItems.length);
    });
    /*
    it("Should have a clickable item", () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const clickableItem = wrapper.find(`[data-test="main-menu-clickable"]`);
      expect(clickableItem.html()).toBeDefined();
    });
    */
  })
  
 
})