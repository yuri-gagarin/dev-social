import React from "react";
import {mount, shallow} from "enzyme";

import { MainNav } from "../../src/components/navbar/MainNav";
import MainNavConnected from "../../src/components/navbar/MainNav";

import {navReducer} from "../../src/redux/reducers/uiReducers";

import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import store from "../../src/redux/store";

import mockStore from "../mockStore";

//initial state mock store
const testStore = mockStore(store.getState());


describe("MainNav Component tests", () => {
  describe("Full mount rendering tests", () => {
    describe("Desktop Screen {minWdith=1024}", () => {
      beforeAll(() => {
        global.innerWidth = 1024;
      });
      const {authState, navState} = store.getState();
      const wrapper = mount(<Router><MainNav navState={navState} authState={authState} /></Router>);
      it("Should render {NavvbarDesktop} without errors", () => {
        let desktopNav = wrapper.find(`[data-test="navbar-desktop"]`);
        let tabletNav = wrapper.find(`[data-test="navbar-tablet"]`);
        let handHeldNav = wrapper.find(`[data-test="navbar-handheld"]`);
        //desktop should be true
        expect(desktopNav.getElements().length > 0).toEqual(true);
        //others should not
        expect(tabletNav.getElements().length).toEqual(0);
        expect(handHeldNav.getElements().length).toEqual(0);
      });
    });
  });
  describe("Shallow tests", () => {
    const {authState, navState} = store.getState();
    const wrapper = shallow(<MainNav navState={navState} authState={authState} />);
    it("Should have an {onPusherToggle} function", () => {
      const componentInstance = wrapper.instance();
      expect(componentInstance.onPusherToggle).toBeDefined();
      expect(typeof componentInstance.onPusherToggle === 'function').toEqual(true);
    });
    it("Should have pass certain properties to the child component", () => {
      const desktopComp = wrapper.find(`[data-test="navbar-desktop"]`);
      expect(desktopComp.props().onPusherToggle).toBeDefined();
      expect(desktopComp.props().logoutUser).toBeDefined();
      expect(desktopComp.props().authState).toBeDefined();
      expect(desktopComp.props().navState).toBeDefined();
     // console.log(desktopComp.props());
    });
  });
  describe("Integration test with child components", () => {
    //console.log(testStore.getState());
    const wrapper = mount(
    <Router>
      <Provider store={testStore}>
         <MainNavConnected />
      </Provider>
    </Router>

    );
    it("Should have a wrapper", () => {
      console.log(wrapper.find(`[data-test="main-nav"]`).debug());
    })
    describe("function click simulations pusher", () => {

    });
    describe("function click simulations {MainMenu}", () => {

    });
    describe("function click simulations {InnerMainMenu", () => {

    });

  });
      
});
