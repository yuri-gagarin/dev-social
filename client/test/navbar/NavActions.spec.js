import * as navActions from "../../src/redux/actions/navActions";
import * as cases from "../../src/redux/cases";
import {guestNav, userNav, dashData} from "../../src/components/navbar/nav_data/navData.js";
import mocksStore from "../mockStore";

const store = mocksStore({
  authState: {
    userLoggedIn: false,
  },  
  navState: {
  },
  postState: {},
});

describe("Nav Action tests", () => {
  describe("Toggle button unit test", () => {
    //
  })
  describe("Menu sidebars actions toggle tests", () => {
    //logged in user
    describe("Guest user, not logged in", () => {
      describe("{openMain} action test", () => {
        const {authState} = store.getState();
        afterEach(() => {
          store.clearActions();
        });
        it(`Should dispatch an ${cases.OPEN_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_MAIN, payload: guestNav.main.data}
          ]        
          store.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          expect(store.getActions()).toEqual(expectedActions);
        });
        it("Should pass a payload array to the reducer for guest menus", () => {
          store.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          const actionPayload = store.getActions()[0].payload;
          expect(Array.isArray(actionPayload)).toEqual(true);
          expect(actionPayload).toEqual(guestNav.main.data);

        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if can't build a menu`, () => {
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          store.dispatch(navActions.openMain(authState, undefined));
          const actionPayload = store.getActions()[0].payload;
          expect(store.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
      describe("{openInnerMain} action test", () => {
        afterEach(() => {
          store.clearActions();
        });
        const contentToOpen = guestNav.innerMain;
        const {authState} = store.getState();
        it(`Should dispatch an ${cases.OPEN_INNER_MAIN} action`, () => {
          for (let target in contentToOpen) {
            store.clearActions();
            const expectedActions = [
              {type: cases.OPEN_INNER_MAIN, payload: guestNav.innerMain[target]}
            ];
            store.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            expect(store.getActions()).toEqual(expectedActions);
          } 
        });
        it("Should pass a payload array to the reducer", () => {
          for (let target in contentToOpen) {
            store.clearActions();
            store.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            const actionPayload = store.getActions()[0].payload;
            expect(Array.isArray(actionPayload)).toEqual(true);
            expect(actionPayload).toEqual(guestNav.innerMain[target]);
          }
        });
        it("Should return an empty array if no nav items available", () => {
          const misClicked = "this doesn't exist";
          store.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, misClicked))
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if it can't build a menu`, () => {
          store.dispatch(navActions.openInnerMain(authState, undefined, "news"));
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          const actionPayload = store.getActions()[0].payload
          expect(store.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
    });
    // end guest user
    describe("Logged in user", () => {
      describe("{openMain} action test", () => {
        const {authState} = store.getState();
        afterEach(() => {
          store.clearActions();
        });
        beforeEach(() => {
          authState.userLoggedIn = true;
        })
        it(`Should dispatch an ${cases.OPEN_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_MAIN, payload: userNav.main.data}
          ]
          store.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          expect(store.getActions()).toEqual(expectedActions);
        });
        it("Should pass a payload array to the reducer", () => {
          store.dispatch(navActions.openMain(authState, {guestNav: guestNav, userNav: userNav}));
          const actionPayload = store.getActions()[0].payload;
          expect(Array.isArray(actionPayload)).toEqual(true);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if can't build a menu`, () => {
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          store.dispatch(navActions.openMain(authState, undefined));
          const actionPayload = store.getActions()[0].payload;
          expect(store.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
      describe("{openInnerMain} action test", () => {
        const contentToOpen = userNav.innerMain;
        const {authState} = store.getState();
        afterEach(() => {
          store.clearActions();
        });
        beforeEach(() => {
          authState.userLoggedIn = true;
        });
        it(`Should dispatch an ${cases.OPEN_INNER_MAIN} action`, () => {
          for (let target in contentToOpen) {
            store.clearActions();
            const expectedActions = [
              {type: cases.OPEN_INNER_MAIN, payload: userNav.innerMain[target]}
            ];
            store.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            expect(store.getActions()).toEqual(expectedActions);
          } 
        });
        it("Should pass a payload array to the reducer", () => {
          for (let target in contentToOpen) {
            store.clearActions();
            store.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, target));
            const actionPayload = store.getActions()[0].payload;
            expect(Array.isArray(actionPayload)).toEqual(true);
          }
        });
        it("Should return an empty array if no nav items available", () => {
          const misClicked = "this doesn't exist";
          store.dispatch(navActions.openInnerMain(authState, {guestNav: guestNav, userNav: userNav}, misClicked))
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if it can't build a menu`, () => {
          store.dispatch(navActions.openInnerMain(authState, undefined, "news"));
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: new Error("Can't get menu data")}
          ];
          const actionPayload = store.getActions()[0].payload
          expect(store.getActions()).toEqual(expectedActions);
          expect(actionPayload instanceof Error).toEqual(true);
        });
      });
    });

    //end logged in user //
    describe("Menu sidebars close actions tests, {authState} is not relevant", () => {
      describe("{closeMain} action test", () => {
        afterEach(() => {
          store.clearActions();
        });
        it(`should dispatch a ${cases.CLOSE_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.CLOSE_MAIN, payload: []}
          ];
          store.dispatch(navActions.closeMain());
          expect(store.getActions()).toEqual(expectedActions);
        });
        it(`Should return an empty array to the payload`, () => {
          store.dispatch(navActions.closeMain());
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        }); 
      });
      describe("{closeInnerMain} action tests", () => {
        afterEach(() => {
          store.clearActions();
        });
        it(`should dispatch a ${cases.CLOSE_INNER_MAIN} action`, () => {
          const expectedActions = [
            {type: cases.CLOSE_INNER_MAIN, payload: []}
          ];
          store.dispatch(navActions.closeInnerMain());
          expect(store.getActions()).toEqual(expectedActions);
        });
        it('Should return an empty array to the payload', () => {
          store.dispatch(navActions.closeInnerMain());
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
      });
    });
  }); 
  
  //navbar dashboard action tests //
  describe("Dashboard toggle actions tests", () => {
    describe("A guest user, no user logged in", () => {
      const {authState} = store.getState();
      describe("{openDash} actions tests", () => {
        beforeEach(() => {
          authState.userLoggedIn = false;
        });
        afterEach(() => {
          store.clearActions();
        });
        it(`Should dispatch an ${cases.OPEN_DASH} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_DASH, payload: dashData.guestDash}
          ];
          store.dispatch(navActions.openDash(authState, dashData));
          expect(store.getActions()).toEqual(expectedActions);
        });
        it("Should return an empty array", () => {
          store.dispatch(navActions.openDash(authState, dashData));
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if an error occures`, () => {
          const badData = {key: "bad data here"};
          const error = new Error("Can't fetch the dashboard data");
          store.dispatch(navActions.openDash(authState, badData));
          const errorPayload = store.getActions()[0].payload;
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: error}
          ];
          expect(store.getActions()).toEqual(expectedActions);
          expect(errorPayload instanceof Error).toEqual(true);
        });
      });
    });
    describe("A user is logged in", () => {
      const {authState} = store.getState();
      describe("{openDash} action tests", () => {
        beforeEach(() => {
          authState.userLoggedIn = true;
        });
        afterEach(() => {
          store.clearActions();
        });
        it(`Should dispatch an ${cases.OPEN_DASH} action`, () => {
          const expectedActions = [
            {type: cases.OPEN_DASH, payload: dashData.userDash}
          ];
          store.dispatch(navActions.openDash(authState, dashData));
          expect(store.getActions()).toEqual(expectedActions);
        });
        it("Should return an array with user data to fill user dashboard", () => {
          store.dispatch(navActions.openDash(authState, dashData));
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(dashData.userDash.length);
        });
        it(`Should dispatch a ${cases.NAV_ERROR} action if an error occures`, () => {
          const badData = {key: "Very bad data"};
          const error = new Error("Can't fetch the dashboard data");
          store.dispatch(navActions.openDash(authState, badData));
          const errorPayload = store.getActions()[0].payload;
          const expectedActions = [
            {type: cases.NAV_ERROR, payload: error}
          ];
          expect(store.getActions()).toEqual(expectedActions);
          expect(errorPayload instanceof Error).toEqual(true);
        });
      });
    });
    //possibly different dashboard for moderators, administrators, users
    //for later
    describe("Dashboard close action test {authState} is irrelevant",  () => {
      describe("{closeDash} actions tests", () => {
        afterEach(() => {
          store.clearActions();
        });
        it(`Should dispatch a ${cases.CLOSE_DASH} action`, () => {
          const expectedActions = [
            {type: cases.CLOSE_DASH, payload: []}
          ];
          store.dispatch(navActions.closeDash());
          expect(store.getActions()).toEqual(expectedActions);
        });
        it("Should return an empty array into the action payload", () => {
          store.dispatch(navActions.closeDash());
          const expectedPayload = store.getActions()[0].payload;
          expect(Array.isArray(expectedPayload)).toEqual(true);
          expect(expectedPayload.length).toEqual(0);
        });
      });
    });
  });
  // end navbar dashboard action tests //
});
