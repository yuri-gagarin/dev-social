import React from "react";
import {shallow} from "enzyme";

import DashOpenButton from "../../src/components/navbar/nav_components/DashOpenButton";
import UserDashboard from "../../src/components/navbar/nav_components/UserDashboard";
import { setElem } from "../helpers/helperFunctions";

import store from "../../src/redux/store";
//import mockStore from "../mockStore";
//const testStore = mockStore(store.getState());
const props = {
  authState: store.getState().authState,
};

describe("DashComponents test", () => {
  describe("DashOpenButton", () => {
    describe("User NOT Logged In", () => {
      const wrapper = shallow(<DashOpenButton {...props} />);
      it("Should NOT be rendered", () => {
        const openDashBtn = setElem(wrapper, "open-dash-btn");
        expect(openDashBtn.exists()).toEqual(false);
      });
    });
    describe("User Logged in", () => {
      const newProps = {...props};
      newProps.authState.userLoggedIn = true;
      const wrapper = shallow(<DashOpenButton {...newProps} />);
      it("Should be rendered", () => {
        const openDash = setElem(wrapper, "open-dash-btn");
        expect(openDash.exists()).toEqual(true);
      });
      it("Should have an onClick - {openDash} defined in properties", () => {
        const openDashBtn = setElem(wrapper, "open-dash-btn");
        expect(openDashBtn.props().onClick).toBeDefined();
        expect(typeof openDashBtn.props().onClick).toBeDefined();
      });
    });
  });
  describe("UserDashboard tests", () => {
    const wrapper = shallow(<UserDashboard />)
    describe("Default state fot UserDashboard", () => {
      it("Return UserDashboard component", () => {
        const userDash = setElem(wrapper, "user-dash");
        expect(userDash.exists()).toBe(true);
      });
      it("Should be invisible by default", () => {

      });
      it("Should have an onClick - {closeDash} function", () => {

      });
    });
    describe("{navState.dashOpen === true} UserDash open", () => {
      const wrapper = shallow(<UserDashboard />);
      it("Return UserDashboard component", () => {
        const userDash = setElem(wrapper, "user-dash");
        expect(userDash.exists()).toBe(true);
      });
      it("Should be visible", () => {

      });
    });
  });
});
