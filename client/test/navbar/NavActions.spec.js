import * as navActions from "../../src/redux/actions/navActions";
import {toggleClose, toggleOpen} from "../../src/components/navbar/helpers/toggleButtons";

import React from "react";
import MainMenu from "../../src/components/navbar/nav_components/MainMenu";
import InnerMainMenu from "../../src/components/navbar/nav_components/InnerMainMenu";

import {shallow} from "enzyme";

describe("Nav Action tests", () => {
  describe("Toggle button unit test", () => {

  })
  describe("Toggle buttons", () => {
    const mockOpenElement = React.createElement("div", {onClick: toggleOpen, "data-value": "mock-open" });
    const mockCloseElement = React.createElement("div", {onClick: toggleClose, "data-value": "mock-close" });
    
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
      console.log(wrapper);
    })
    it("should toggle open the main menu", () => {
      console.log(mainMenu.props());
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
})