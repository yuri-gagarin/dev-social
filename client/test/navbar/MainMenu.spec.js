import React from "react";
import {shallow, mount} from "enzyme";
import MainMenu from "../../src/components/navbar/nav_components/MainMenu";

//import  from "../../sr"

describe("Main Menu sidebar test", () => {
  const props = {
    authState: {
      loggedIn: false,
    },
    navState: {
      mainItems: [{name: "a", key: 1}, {name: "b", key: 2}]
    },
  };
  const wrapper = shallow(<MainMenu {...props}/>);
  it("should render", () => {
    //const wrapper = shallow(<MainMenu {...props} />);
    expect(wrapper).toBeDefined();
  });
  describe("Close main menu item", () => {
    it("Should have a a close menu clickable item", () => {
      const mainMenuClose = wrapper.find(`[data-test="main-menu-close"]`);
      expect(mainMenuClose.html()).toBeDefined();
    });
    it("Should have a onClick prop function", () => {
      const mainMenuClose = wrapper.find(`[data-test="main-menu-close"]`);
      expect(typeof mainMenuClose.props().onClick).toEqual('function');
    })
  });
  describe("Main menu clickable items", () => {
    it("Should have equal items to {navState.mainItem}", () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const clickableItems = wrapper.find(`[data-test="main-menu-clickable"]`);
      expect(clickableItems.length).toEqual(props.navState.mainItems.length);
    });
    it("Should have a clickable item", () => {
      const wrapper = shallow(<MainMenu {...props} />);
      const clickableItems = wrapper.find(`[data-test="main-menu-clickable"]`);
      for(item in clickableItems) {
        expect(item.html()).toBeDefined();
      }
    });
  })
  
 
})