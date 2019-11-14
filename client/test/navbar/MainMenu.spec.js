import React from "react";
import {shallow} from "enzyme";
import MainMenu from "../../src/components/navbar/nav_components/MainMenu";


describe("Main Menu sidebar test", () => {
  const props = {
    authState: {},
    navState: {
      mainItems: [{name: "a", key: 1}]
    },
  }
  it("should render", () => {
    const wrapper = shallow(<MainMenu {...props} />);
    console.log(wrapper.instance());
  });
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
  it("Should have a clickable item", () => {
    const wrapper = shallow(<MainMenu {...props} />);
    const clickableItem = wrapper.find(`[data-test="main-menu-clickable"]`);
    expect(clickableItem.html()).toBeDefined();
  });
})