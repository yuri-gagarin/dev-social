import {navReducer} from "../../src/redux/reducers/uiReducers";
//import * as navActions from "../../src/redux/actions/navActions";
import * as cases from "../../src/redux/cases";


const navState = {
  pusherVisible: false,
  mainVisible: false,
  innerMainVisible: false,
  dashOpen: false,
  mainItems: [],
  innerMainItems: [],
  dashItems: [],
};
describe("NavReducer Tests", () => {
  it("Should return the initial state", () => {
    expect(navReducer(navState, {})).toEqual(navState);
  });
  it("Should return the initial state with no arguments", () => {
    expect(navReducer(undefined, {})).toEqual(navState);
  });
  it(`Should successfully handle the ${cases.OPEN_MAIN} action`, () => {
    const mockMainItems = [{name: "a", key: "1", name: "b", key: "2"}];
    const expectedState = {
      ...navState,
      pusherVisible: true,
      mainVisible: true,
      mainItems: [...mockMainItems],
      navError: null,
    };
    expect(navReducer(navState, {type: cases.OPEN_MAIN, payload: mockMainItems})).toEqual(expectedState);
  });
  it(`Should successfully handle the ${cases.CLOSE_MAIN} action`, () => {
    const expectedState = {
      ...navState,
      pusherVisible: false,
      mainVisible: false,
      innerMainVisible: false,
      mainItems: [],
      navError: null,
    };
    expect(navReducer(navState, {type: cases.CLOSE_MAIN, payload: []})).toEqual(expectedState);
  });
  it(`Should successfully handle the ${cases.OPEN_INNER_MAIN} action`, () => {
    const mockInnerMainItems = [{name: "a", key: "1", name: "b", key: "2"}];
    const expectedState = {
      ...navState,
      pusherVisible: true,
      mainVisible: true,
      innerMainVisible: true,
      innerMainItems: [...mockInnerMainItems],
      navError: null,
    };
    expect(navReducer(navState, {type: cases.OPEN_INNER_MAIN, payload: mockInnerMainItems})).toEqual(expectedState);
  });
  
  it(`Should successfully handle the ${cases.CLOSE_INNER_MAIN} action`, () => {
    const expectedState = {
      ...navState,
      innerMainVisible: false,
      innerMainItems: [],
      navError: null,
    };
    expect(navReducer(navState, {type: cases.CLOSE_INNER_MAIN, payload: []})).toEqual(expectedState);
  });
  it(`Should successfuly handle the ${cases.OPEN_DASH} action`, () => {
    const mockDashItems = [{name: "a", key: "1", name: "b", key: "2"}];
    const expectedState = {
      ...navState,
      pusherVisible: true,
      dashOpen: true,
      dashItems: mockDashItems,
      navError: null,
    };
    const newState = navReducer(navState, {type: cases.OPEN_DASH, payload: mockDashItems});
    expect(newState).toEqual(expectedState);
  });
  it(`Should successfully handle the ${cases.CLOSE_DASH} action`, () => {
    const expectedState = {
      ...navState,
      pusherVisible: false,
      dashOpen: false,
      dashItems: [],
      navError: null,
    };
    const newState = navReducer(navState, {type: cases.CLOSE_DASH, payload: []});
    expect(newState).toEqual(expectedState);
  });
  it(`Should successfully handle the ${cases.NAV_ERROR} action`, () => {
    const anError = new Error("Error occured");
    const expectedState = {
      ...navState,
      navError: {
        error: anError,
        errorMessage: anError.message,
      }
    };
    const newState = navReducer(navState, {type: cases.NAV_ERROR, payload: anError});
    expect(newState).toEqual(expectedState);
    expect(newState.navError.error instanceof Error).toEqual(true);
    expect(newState.navError.errorMessage).toEqual(anError.message);
  })
});