import * as navActions from "../../src/redux/actions/navActions";
import * as cases from "../../src/redux/cases";

import {guestNav, userNav} from "../../src/components/navbar/nav_data/navData.js";


import React from "react";
import MainMenu from "../../src/components/navbar/nav_components/MainMenu";
import InnerMainMenu from "../../src/components/navbar/nav_components/InnerMainMenu";

import {shallow} from "enzyme";

import mockStore from "../mockStore";

describe("Nav Action tests", () => {
  describe("Toggle button unit test", () => {
    //
  })
  describe("{openMain} action test", () => {
    afterEach(() => {
      mockStore.clearActions();
    });
    it("Should dispatch an open main action", () => {
      const expectedActions = [
        {type: cases.OPEN_MAIN, payload: guestNav.main.data}
      ]
      const {authState} = mockStore.getState();
      mockStore.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
      expect(mockStore.getActions()).toEqual(expectedActions);
    });
    it("Should pass a payload array to the reducer", () => {
      const {authState} = mockStore.getState();
      mockStore.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
      const actionPayload = mockStore.getActions()[0].payload;
      expect(Array.isArray(actionPayload)).toEqual(true);
    });
  })
  describe("{openInnerMain} action test", () => {
    afterEach(() => {
      mockStore.clearActions();
    });
    const contentToOpen = guestNav.innerMain;
    const {authState} = mockStore.getState();
    it("Should dispatch an open inner main action", () => {
      for (let target in contentToOpen) {
        mockStore.clearActions();
        const expectedActions = [
          {type: cases.OPEN_INNER_MAIN, payload: guestNav.innerMain[target]}
        ];
        mockStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
        expect(mockStore.getActions()).toEqual(expectedActions);
      } 
    });
    it("Should pass a payload array to the reducer", () => {
      for (let target in contentToOpen) {
        mockStore.clearActions();
        mockStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
        const actionPayload = mockStore.getActions()[0].payload;
        expect(Array.isArray(actionPayload)).toEqual(true);
      }
    });
    it("Should dispatch an error it can't build a menu", () => {
      const {authState} = mockStore.getState();
      mockStore.dispatch(navActions.openMain(authState, undefined));
      const expectedActions = [
        {type: cases.NAV_ERROR, payload: new Error("Cant get menu data")}
      ];
      expect(mockStore.getActions()).toEqual(expectedActions);
      expect(mockStore.getActions()[0].payload instanceof Error).toEqual(true);
    });
  });
  /** 
  describe("Toggle buttons", () => {
    const mockOpenElement = React.createElement("div", {onClick: toggleOpen, "data-value": "mock-open" });
    const mockCloseElement = React.createElement("div", {onClick: toggleClose, "data-value": "mock-close" });
    const mockEvent = {target: {"data-value": "open-main", 
                                getAttribute(val) {
                                  //console.log(this);
                                  //return this.target["data-value"];
                                  return this["data-value"];
                                }
                              }
                            };
  

    it("Should fire off an event", () => {
      const wrapper = shallow(mockOpenElement)
      wrapper.simulate("click", mockEvent);
    })
    
    let mainMenu, innerMainMenu
    const props = {
      navState: {
        mainVisible: false,
        mainItems: [{name: "a", key: 1}],
        innerMainItems: [{name: "a", key: 1}],
      }
    }
    beforeAll(() => {
      mainMenu = shallow(<MainMenu {...props}/>);
      innerMainMenu = shallow(<InnerMainMenu {...props}/>);
    });
    it("Should toggle open", () => {
      const wrapper = shallow(mockOpenElement).html();
    })
    it("should toggle open the main menu", () => {
      mainMenu.simulate("click");
      expect(1).toEqual(1);
    });
    it("should toggle open the inner main menu", () => {

    });
    it("Should toggle close the main menu", () => {

    });
    it("Should toggle close the inner main menu", () => {

    })
  })
  **/
})