import {navReducer} from "../../src/redux/reducers/uiReducers";
import * as navActions from "../../src/redux/actions/navActions";
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
  it(`Should successfully handle ${cases.OPEN_MAIN} action`, () => {
    const mockMainItems = [{name: "a", key: "1", name: "b", key: "2"}];
    const expectedState = {
      ...navState,
      pusherVisible: true,
      mainVisible: true,
      mainItems: [...mockMainItems],
    };
    expect(navReducer(navState, {type: cases.OPEN_MAIN, payload: mockMainItems})).toEqual(expectedState);
  });
  it(`Should successfully handle ${cases.CLOSE_MAIN} action`, () => {
    const expectedState = {
      ...navState,
      pusherVisible: false,
      mainVisible: false,
      innerMainVisible: false,
      mainItems: [],
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
    };
    expect(navReducer(navState, {type: cases.OPEN_INNER_MAIN, payload: mockInnerMainItems})).toEqual(expectedState);
  });
  it(`Should successfullt handle the ${cases.CLOSE_MAIN} action`, () => {
    const expectedState = {
      ...navState,
      pusherVisible: false,
      mainVisible: false,
      innerMainVisible: false,
      mainItems: [],
    };
    expect(navReducer(navState, {type: cases.CLOSE_MAIN, payload: []})).toEqual(expectedState);
  });

});