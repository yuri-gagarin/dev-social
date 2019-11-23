import React from "react";
import {mount, shallow} from "enzyme";

import { MainNav } from "../../src/components/navbar/MainNav";
import MainNavConnected from "../../src/components/navbar/MainNav";

import {navReducer} from "../../src/redux/reducers/uiReducers";

import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import store from "../../src/redux/store";

import mockStore from "../mockStore";
import { MenuItem } from "semantic-ui-react";
import { ECANCELED } from "constants";

jest.useFakeTimers();

//initial state mock store
const testStore = mockStore(store.getState());

const setElem = (wrapper, testElement)  => {
  return wrapper.find(`[data-test="${testElement}"]`);
}
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
  describe("Integration test with child components", () => {
    //console.log(testStore.getState());
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <MainNavConnected />
        </Provider>
      </Router>
    );
    it("Should render the {MainNav} component", () => {
      //console.log(wrapper.find(`[data-test="main-nav"]`).debug());
      const mainNav = setElem(wrapper, "main-nav");
      expect(mainNav.exists()).toEqual(true);
    });
    describe("click buttons on nav-menu and pusher", () => {
      const openMainBtn = setElem(wrapper, "desktop-open-main-btn");
      it("should open main menu and set {MainMenu.props.visible === true}", () => {
        openMainBtn.at(0).simulate("click");
        wrapper.update();
        const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
        expect(mainMenuVisible).toBe(true);
      });
      it("should not open inner main menu, {InnerMainMenu.visible === false", () => {
        const innerMainMenuVisible = setElem(wrapper, "inner-main-menu-sidebar").at(0).props().visible;
        expect(innerMainMenuVisible).toBe(false);
      });
      it("should have the appropriate number of main menu items", () => {
        const mainMenuItems = setElem(wrapper, "main-menu-clickable");
        let count = 0;
        mainMenuItems.forEach((item) => {
          //we have duplicates HTMLAnchor and Item here because of semantic framework
          let itemInstance  = item.instance();
          if(itemInstance instanceof MenuItem) count += 1;
        });
        expect(count).toEqual(4);
      });
      it("Should open the inner-main-menu and set {InnerMenu.props.visible === true}", () => {
        const mainMenuClickable = setElem(wrapper, "main-menu-clickable");
        mainMenuClickable.at(0).simulate("click");
        wrapper.update();
        const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
        const innerMainMenuVisible = setElem(wrapper, "inner-main-menu-sidebar").at(0).props().visible;
        expect(mainMenuVisible).toBe(true);
        expect(innerMainMenuVisible).toBe(true);
      });
      it("Should close both on main click with a delay", () => {
        const mainMenuClose = setElem(wrapper, "main-menu-close");
        mainMenuClose.at(0).simulate("click");
        jest.runAllTimers();
        wrapper.update();
        const innerMainMenuVisible = setElem(wrapper, "inner-main-menu-sidebar").at(0).props().visible;
        const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
        expect(innerMainMenuVisible).toBe(false);
        expect(mainMenuVisible).toBe(false);
      });
    });

    describe("function click simulations pusher", () => {
      describe("pusher click when only {MainMenu} open", () => {
        beforeAll(() => {
          const openMainBtn = setElem(wrapper, "desktop-open-main-btn");
          openMainBtn.at(0).simulate("click");
          wrapper.update();
          const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
          expect(mainMenuVisible).toBe(true);
        });
        it("Should close the {MainMenu}", () => {
          wrapper.find("MainNav").instance().onPusherToggle();
          wrapper.update();
          const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
          expect(mainMenuVisible).toBe(false);
        })
      })
      describe("pusher click when both {MainMenu} and {InnerMainMenu} open", () => {
        beforeAll(() => {
          const openMainBtn = setElem(wrapper, "desktop-open-main-btn");
          openMainBtn.at(0).simulate("click");
          wrapper.update();
          const mainMenuClickable = setElem(wrapper, "main-menu-clickable");
          mainMenuClickable.at(0).simulate("click");
          const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
          const innerMainMenuVisible = setElem(wrapper, "inner-main-menu-sidebar").at(0).props().visible;
          expect(mainMenuVisible).toBe(true);
          expect(innerMainMenuVisible).toBe(true);
        });
        it("Should close both {MainMenu} and {InnerMainMenu}", () => {
          wrapper.find("MainNav").instance().onPusherToggle();
          jest.runAllTimers();
          wrapper.update();
          const mainMenuVisible = setElem(wrapper, "main-menu-sidebar").at(0).props().visible;
          const innerMainMenuVisible = setElem(wrapper, "inner-main-menu-sidebar").at(0).props().visible;
          expect(mainMenuVisible).toBe(false);
          expect(innerMainMenuVisible).toBe(false);
        });
      });
    });
    describe("User is not logged in", () => {
      const navAuthComponent = wrapper.find("NavAuthComponent");
      it("Should have a {NavAuth} component", () => {
        expect(navAuthComponent.html()).toBeDefined();
      });
      it("Should pass an {authstate} prop", () => {
        expect(navAuthComponent.props().authState).toBeDefined();
      });
      it("Shoult NOT be logged in by default", () => {
        expect(navAuthComponent.props().authState.userLoggedIn).toEqual(false);
      })
    })
    describe("function click simulations {MainMenu}", () => {

    });
    describe("function click simulations {InnerMainMenu", () => {

    });
   

  });
      
});

//this should be placed separately

/*
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


*/