import React from "react";
import {shallow} from "enzyme";

import DashOpenButton from "../../src/components/navbar/nav_components/DashOpenButton";
import UserDashboard from "../../src/components/navbar/nav_components/UserDashboard";

import { dashData } from "../../src/components/navbar/nav_data/navData"
import { setElem } from "../helpers/helperFunctions";

import store from "../../src/redux/store";
//import mockStore from "../mockStore";
//const testStore = mockStore(store.getState());


describe("DashComponents test", () => {
  describe("DashOpenButton", () => {
    const props = {
      authState: store.getState().authState,
    };
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
    describe("User Logged in", () => {
      const mockItems = dashData.userDash;
        const props = {
          authState: {
            userLoggedIn: true,
          },
          navState: {...store.getState().navState, dashOpen: true, dashItems: [...mockItems]},
        };
      const wrapper = shallow(<UserDashboard {...props} />)
      describe("Default state for UserDashboard", () => {
        const userDash = setElem(wrapper, "user-dash");
        it("Return UserDashboard component", () => {
          expect(userDash.exists()).toBe(true);
        });
        it("Should be invisible by default", () => {
          expect(userDash.props().visible).toBe(true);
        });
        it("Should have an onClick - {closeDash} function", () => {
          const closeDashclickable = setElem(wrapper, "close-dash-btn");
          expect(closeDashclickable.props().onClick).toBeDefined();
          expect(typeof closeDashclickable.props().onClick).toEqual("function");
        });
      });
      describe("{navState.dashOpen === true} UserDash open", () => {
        const wrapper = shallow(<UserDashboard {...props} />);
        const userDash = setElem(wrapper, "user-dash");
        it("Return UserDashboard component", () => {
          expect(userDash.exists()).toBe(true);
        });
        it("Should be visible", () => {
          expect(userDash.props().visible).toBe(true);
        });
        it("Should render the dash items", () => {
          const userDashItems = setElem(wrapper, "user-dash-item");
          expect(userDashItems.exists()).toBe(true);
        });
        it("Should correctly map and render dash items", () => {
          const userDashItems = setElem(wrapper, "user-dash-item");
          expect(userDashItems.length).toBe(dashData.userDash.length);
          for (let item of userDashItems) {
            expect(item.props.onClick).toBeDefined();
            expect(typeof item.props.onClick).toEqual("function");
            expect(item["data-value"]).toBeDefined();
          }
        });
      });
    });
    
  });
});
