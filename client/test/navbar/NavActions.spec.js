import * as navActions from "../../src/redux/actions/navActions";
import * as cases from "../../src/redux/cases";
import {guestNav, userNav, dashData} from "../../src/components/navbar/nav_data/navData.js";
import mockStore from "../mockStore";
import store from "../../src/redux/store";

const defaultState = store.getState();

const testStore = mockStore(defaultState);

describe("Nav Action tests", () => {
  describe("Toggle button unit test", () => {
    //
    describe(`{openMain} function tests`, () => {
      const initialStore = store.getState();

      //openMain();
      const newStore = store.getState();
    });
    describe(`{closeMain} function tests`, () => {
      
    });
    describe(`{openInnerMain} function tests`, () => {

    });
    describe(`{closeInnerMain} function tests`, () => {

    })
  })
  describe("Menu sidebars actions toggle tests", () => {
    //logged in user
    describe("Guest user, not logged in", () => {
      describe("{openMain} action test", () => {
        const {authState} = testStore.getState();
        afterEach(() => {
          testStore.clearActions();
        });
        it(`Should dispatch an ${cases.OPEN_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_MAIN, payload: guestNav.main.data}
          ]        
          testStore.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it("Should pass a payload array to the reducer for guest menus", () => {
          testStore.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          const actionPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(actionPayload)).toEqual(true);
          expect(actionPayload).toEqual(guestNav.main.data);

        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if can't build a menu`, () => {
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          testStore.dispatch(navActions.openMain(authState, undefined));
          const actionPayload = testStore.getActions()[0].payload;
          expect(testStore.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
      describe("{openInnerMain} action test", () => {
        afterEach(() => {
          testStore.clearActions();
        });
        const contentToOpen = guestNav.innerMain;
        const {authState} = testStore.getState();
        it(`Should dispatch an ${cases.OPEN_INNER_MAIN} action`, () => {
          for (let target in contentToOpen) {
            testStore.clearActions();
            const expectedActions = [
              {type: cases.OPEN_INNER_MAIN, payload: guestNav.innerMain[target]}
            ];
            testStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            expect(testStore.getActions()).toEqual(expectedActions);
          } 
        });
        it("Should pass a payload array to the reducer", () => {
          for (let target in contentToOpen) {
            testStore.clearActions();
            testStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            const actionPayload = testStore.getActions()[0].payload;
            expect(Array.isArray(actionPayload)).toEqual(true);
            expect(actionPayload).toEqual(guestNav.innerMain[target]);
          }
        });
        it("Should return an empty array if no nav items available", () => {
          const misClicked = "this doesn't exist";
          testStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, misClicked))
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if it can't build a menu`, () => {
          testStore.dispatch(navActions.openInnerMain(authState, undefined, "news"));
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          const actionPayload = testStore.getActions()[0].payload
          expect(testStore.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
    });
    // end guest user
    describe("Logged in user", () => {
      describe("{openMain} action test", () => {
        const {authState} = testStore.getState();
        afterEach(() => {
          testStore.clearActions();
        });
        beforeEach(() => {
          authState.userLoggedIn = true;
        })
        it(`Should dispatch an ${cases.OPEN_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_MAIN, payload: userNav.main.data}
          ]
          testStore.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it("Should pass a payload array to the reducer", () => {
          testStore.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          const actionPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(actionPayload)).toEqual(true);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if can't build a menu`, () => {
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          testStore.dispatch(navActions.openMain(authState, undefined));
          const actionPayload = testStore.getActions()[0].payload;
          expect(testStore.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
      describe("{openInnerMain} action test", () => {
        const contentToOpen = userNav.innerMain;
        const {authState} = testStore.getState();
        afterEach(() => {
          testStore.clearActions();
        });
        beforeEach(() => {
          authState.userLoggedIn = true;
        });
        it(`Should dispatch an ${cases.OPEN_INNER_MAIN} action`, () => {
          for (let target in contentToOpen) {
            testStore.clearActions();
            const expectedActions = [
              {type: cases.OPEN_INNER_MAIN, payload: userNav.innerMain[target]}
            ];
            testStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            expect(testStore.getActions()).toEqual(expectedActions);
          } 
        });
        it("Should pass a payload array to the reducer", () => {
          for (let target in contentToOpen) {
            testStore.clearActions();
            testStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            const actionPayload = testStore.getActions()[0].payload;
            expect(Array.isArray(actionPayload)).toEqual(true);
          }
        });
        it("Should return an empty array if no nav items available", () => {
          const misClicked = "this doesn't exist";
          testStore.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, misClicked))
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if it can't build a menu`, () => {
          testStore.dispatch(navActions.openInnerMain(authState, undefined, "news"));
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          const actionPayload = testStore.getActions()[0].payload
          expect(testStore.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
    });

    //end logged in user //
    describe("Menu sidebars close actions tests, {authState} is not relevant", () => {
      describe("{closeMain} action test", () => {
        afterEach(() => {
          testStore.clearActions();
        });
        it(`should dispatch a ${cases.CLOSE_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.CLOSE_MAIN, payload: []}
          ];
          testStore.dispatch(navActions.closeMain());
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it(`Should return an empty array to the payload`, () => {
          testStore.dispatch(navActions.closeMain());
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        }); 
      });
      describe("{closeInnerMain} action tests", () => {
        afterEach(() => {
          testStore.clearActions();
        });
        it(`should dispatch a ${cases.CLOSE_INNER_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.CLOSE_INNER_MAIN, payload: []}
          ];
          testStore.dispatch(navActions.closeInnerMain());
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it('Should return an empty array to the payload', () => {
          testStore.dispatch(navActions.closeInnerMain());
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
      });
    });
  }); 
  
  //navbar dashboard action tests //
  describe("Dashboard toggle actions tests", () => {
    describe("A guest user, no user logged in", () => {
      const {authState} = testStore.getState();
      describe("{openDash} actions tests", () => {
        beforeEach(() => {
          authState.userLoggedIn = false;
        });
        afterEach(() => {
          testStore.clearActions();
        });
        it(`Should dispatch an ${cases.OPEN_DASH} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_DASH, payload: dashData.guestDash}
          ];
          testStore.dispatch(navActions.openDash(authState, dashData));
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it("Should return an empty array", () => {
          testStore.dispatch(navActions.openDash(authState, dashData));
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if an error occures`, () => {
          const badData = {key: "bad data here"};
          const error = new Error("Can't fetch the dashboard data");
          testStore.dispatch(navActions.openDash(authState, badData));
          const errorPayload = testStore.getActions()[0].payload;
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: error}
          ];
          expect(testStore.getActions()).toEqual(expectedActions);
          expect(errorPayload instanceof Error).toEqual(true);
        });
      });
    });
    describe("A user is logged in", () => {
      const {authState} = testStore.getState();
      describe("{openDash} action tests", () => {
        beforeEach(() => {
          authState.userLoggedIn = true;
        });
        afterEach(() => {
          testStore.clearActions();
        });
        it(`Should dispatch an ${cases.OPEN_DASH} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_DASH, payload: dashData.userDash}
          ];
          testStore.dispatch(navActions.openDash(authState, dashData));
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it("Should return an array with user data to fill user dashboard", () => {
          testStore.dispatch(navActions.openDash(authState, dashData));
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(dashData.userDash.length);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if an error occures`, () => {
          const badData = {key: "Very bad data"};
          const error = new Error("Can't fetch the dashboard data");
          testStore.dispatch(navActions.openDash(authState, badData));
          const errorPayload = testStore.getActions()[0].payload;
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: error}
          ];
          expect(testStore.getActions()).toEqual(expectedActions);
          expect(errorPayload instanceof Error).toEqual(true);
        });
      });
    });
    //possibly different dashboard for moderators, administrators, users
    //for later
    describe("Dashboard close action test {authState} is irrelevant",  () => {
      describe("{closeDash} actions tests", () => {
        afterEach(() => {
          testStore.clearActions();
        });
        it(`Should dispatch a ${cases.CLOSE_DASH} action`, () => {
          const expectedActions = [
            {type: cases.CLOSE_DASH, payload: []}
          ];
          testStore.dispatch(navActions.closeDash());
          expect(testStore.getActions()).toEqual(expectedActions);
        });
        it("Should return an empty array into the action payload", () => {
          testStore.dispatch(navActions.closeDash());
          const expectedPayload = testStore.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
      });
    });
  });
  // end navbar dashboard action tests //
});
