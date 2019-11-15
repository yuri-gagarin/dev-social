import React from "react";
import {mount, shallow} from "enzyme";

import {withRouter} from "react-router-dom";
import NavbarDesktop from "../../src/components/navbar/desktop/NavbarDesktop";

describe("DesktopNavbar tests", () => {
  const navProps = {
    history: {},
    authState: {},
    navState: {
      innerMainItems: [{name: "a", key: 1}],
      mainItems: [{name: "a", key: 1}]
    },
    children: [],
    openMain: () => "",
    closeMain: () => "",
    openInnerMain: () => "",
    closeInnerMain: () => "",
    openDash: () => "",
    closeDash: () => "",
    onPusherToggle: () => {},
    logoutUser: () => {},
    fetchData: () => {},
  };

  it("Should render the Navabar", () => {
    const wrapper = shallow(<NavbarDesktop.WrappedComponent {...navProps} />);
    expect(wrapper).toBeDefined();
  })
  describe("Main Sidebar", () => {
    const wrapper = shallow(<NavbarDesktop.WrappedComponent {...navProps} />);
    
  })
  describe("Inner Main Sidebar", () => {

  })
})