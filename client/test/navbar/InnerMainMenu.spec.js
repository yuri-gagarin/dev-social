import InnerMainMenu from "../../src/components/navbar/nav_components/InnerMainMenu";

import {shallow} from "enzyme";

import React from "react";

import store from "../../src/redux/store";
import mockStore from "../mockStore";

const testStore = mockStore(store.getState());

const {authState, navState} = store.getState(); 
//console.log(store.getState());

describe("InnerMainMenu component tests", () => {
  const props = {
    history: {},
    authState: {...authState},
    navState: {...navState},
  };
  describe("Default render", () => {
    const wrapper = shallow(<InnerMainMenu {...props} />);
    it("Should render", () => {
      expect(wrapper.html()).toBeDefined();
      expect(typeof wrapper.html() === "string").toEqual(true);
    });
    it("Should be invisible by default", () => {
      const innerMainMenu = wrapper.find(`[data-test="inner-main-menu-sidebar"]`);
      expect(innerMainMenu.props().visible).toEqual(false);
    });
    describe("Close inner main menu item", () => {
      const wrapper = shallow(<InnerMainMenu {...props} />);
      it("Should have a close inner main menu clickable item", () => {
        const innerMainClose = wrapper.find(`[data-test="inner-main-menu-close"]`);
        expect(innerMainClose.html()).toBeDefined();
      });
      it("Should have an {onClick} prop function defined", () => {
        const innerMainClose = wrapper.find(`[data-test="inner-main-menu-close"]`);
        expect(innerMainClose.props().onClick).toBeDefined();
      });
    });
  
    describe("Inner maim menu clickable items", () => {
      const mockInnerData = [{content: "a", key: 1}, {content: "b", key: 2}];
      const newProps = {...props};
      newProps.navState.innerMainItems = [...mockInnerData];
      const wrapper = shallow(<InnerMainMenu {...newProps} />);
      it("Should have an {onClick} function in props", () => {
        const innerMainItems = wrapper.find(`[data-test="inner-main-menu-clickable"]`);
        for(let item of innerMainItems) {
          expect(item.props.onClick).toBeDefined();
          expect(typeof item.props.onClick === "function").toEqual(true);
        }
      });
      it("Should have the same amount of html elements as passed into {innerMainItems} state", () => {
        const innerMainItems = wrapper.find(`[data-test="inner-main-menu-clickable"]`);
        expect(innerMainItems.length).toEqual(mockInnerData.length);
      });
    });
  });
});
