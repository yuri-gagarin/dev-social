import InnerMainMenu from "../../src/components/navbar/nav_components/InnerMainMenu";
import {shallow} from "enzyme";

import React from "react";

describe("InnerMainMenu component tests", () => {
  const props = {
    history: {},
    authState: {
      loggedIn: false,
    },
    navState: {
      mainItems: [{name: "a", key: 1}, {name: "b", key: 2}],
      innerMainItems: [{name: "a", key: 1}, {name: "b", key: 2}],
    },
  };
  const wrapper = shallow(<InnerMainMenu {...props} />);
  it("Should render", () => {
    console.log(wrapper.html());
  });
  describe("Close inner main menu item", () => {
    it("Should have a close inner main menu clickable item", () => {
      const innerMainClose = wrapper.find(`[data-test="inner-main-menu-close"]`);
      expect(innerMainClose.html()).toBeDefined();
    });
    it("Should have an {onClick} function in props", () => {
      const innerMainItems = wrapper.find(`[data-test="inner-main-menu-clickable]`);
      
    })
  })
  describe("Inner Main Menu clickable item", () => {

  })
});
