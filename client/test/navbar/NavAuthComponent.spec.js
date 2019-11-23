import React from "react";

import {NavAuthComponent} from "../../src/components/navbar/nav_components/NavAuthComponent";
import {shallow} from "enzyme";

import store from "../../src/redux/store";
import mockStore from "../mockStore";

import {setElem} from "../helpers/helperFunctions";

const testStore = mockStore(store.getState());

const props = {
  authState: {...testStore.authState},
  history: {},
  logoutUser: () => null,
};

describe("NavAuthComponent tests", () => {
  describe("User NOT Logged In", () => {
    const wrapper = shallow(<NavAuthComponent {...props} />);
    it("Should render", () => {
      expect(wrapper.exists()).toEqual(true);
    });
    it("Should render a Login button", () => {
      expect(setElem(wrapper, "login-btn").exists()).toEqual(true);
    });
    it("Should have an onClick - {toggleLogin} defined on Login button", () => {
      const loginBtn = setElem(wrapper, "login-btn");
      expect(loginBtn.props().onClick).toBeDefined();
      expect(typeof loginBtn.props().onClick).toEqual("function");
    });
    it("Should render a Register button", () => {
      expect(setElem(wrapper, "register-btn").exists()).toEqual(true);
    });
    it("Should have an onClick - {toggleRegister} defined on Register button", () => {
      const registerBtn = setElem(wrapper, "register-btn");
      expect(registerBtn.props().onClick).toBeDefined();
      expect(typeof registerBtn.props().onClick).toEqual("function");
    })
    it("Should NOT render a Logout button", () => {
      expect(setElem(wrapper, "logout-btn").exists()).toEqual(false);
    });
    it("Should NOT render My Profile button", () => {
      expect(setElem(wrapper, "profile-btn").exists()).toEqual(false);
    });
  });
  describe("User Logged In", () => {
    const newProps = {...props};
    newProps.authState.userLoggedIn = true;
    const wrapper = shallow(<NavAuthComponent {...newProps} />);
    it("Should render", () => {
      expect(wrapper.exists()).toEqual(true);
    });
    it("Should render a Logout button", () => {
      expect(setElem(wrapper, "logout-btn").exists()).toEqual(true);
    });
    it("Should have an onClick - {toggleLogout} defined on Logout button", () => {
      const logoutBtn = setElem(wrapper, "logout-btn");
      expect(logoutBtn.props().onClick).toBeDefined();
      expect(typeof logoutBtn.props().onClick).toEqual("function");
    })
    it("Should render My Profile button", () => {
      expect(setElem(wrapper, "profile-btn").exists()).toEqual(true);
    });
    it("Should have an onClick - {toggleMyProfile} defined on MyProfile button", () => {
      const profileBtn = setElem(wrapper, "profile-btn");
      expect(profileBtn.props().onClick).toBeDefined();
      expect(typeof profileBtn.props().onClick).toEqual("function");
    });
    it("Should NOT render a Login button", () => {
      expect(setElem(wrapper, "login-btn").exists()).toEqual(false);
    });
    it("Should NOT render a Register button", () => {
      expect(setElem(wrapper, "register-btn").exists()).toEqual(false);
    });
  });
});
