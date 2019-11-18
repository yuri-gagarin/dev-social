import * as navActions from "../../src/redux/actions/navActions";
import * as actions from "../../src/redux/cases";

import {guestNav, userNav} from "../../src/components/navbar/nav_data/navData";


import React from "react";
import MainMenu from "../../src/components/navbar/nav_components/MainMenu";
import InnerMainMenu from "../../src/components/navbar/nav_components/InnerMainMenu";

import {shallow} from "enzyme";

import mockStore from "../mockStore";

describe("Nav Action tests", () => {
  describe("Toggle button unit test", () => {
    //
  })
  describe("Main menu toggle buttons function tests", () => {
    afterEach(() => {
      mockStore.clearActions();
    });
    it("Should dispatch an open main action", () => {
      const expectedActions = [
        {type: actions.OPEN_MAIN, payload: guestNav.main.data}
      ]
      const {authState} = mockStore.getState();
      mockStore.dispatch(navActions.openMain(authState));
      expect(mockStore.getActions()).toEqual(expectedActions);
    });
    it("Should dispatch an open inner main action", () => {
      const contentToOpen = guestNav.innerMain;
      const {authState} = mockStore.getState();
      for (let content in contentToOpen) {
        mockStore.clearActions();
        const expectedActions = [
          {type: actions.OPEN_INNER_MAIN, payload: guestNav.innerMain[content]}
        ];
        mockStore.dispatch(navActions.openInnerMain(authState, content));
        console.log("Expected");
        console.log(expectedActions);
        console.log("Actual");
        console.log(mockStore.getActions());
      } 
    });
    
  })
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