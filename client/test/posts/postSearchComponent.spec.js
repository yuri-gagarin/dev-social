import React from "react";
import { shallow } from "enzyme";

import PostSearchComponent from "../../src/components/posts/posts_sidebar/PostSearchComponent";
import { setElem } from "../helpers/helperFunctions";

import moxios from "moxios";


describe("{PostSearchComponent} unit tests", () => {
  const wrapper = shallow(<PostSearchComponent />);

  it("Should render the component", () => {
    const postSearchComponent = setElem(wrapper, "post-search-component");
    expect(postSearchComponent.exists()).toBe(true);
  });
  describe("Default state of {PostSearchComponent}", () => {
    let componentInstance = wrapper.instance();
    it("Should set {loading: false}", () => {
      expect(componentInstance.state.loading).toBe(false);
    });
    it("Should set {results: []}, and be empty", () => {
      expect(Array.isArray(componentInstance.state.results)).toBe(true);
      expect(componentInstance.state.results.length).toEqual(0);
    });
    it("Should NOT have a {message} or {value} by defaul in state", () => {
      expect(componentInstance.state.message).toEqual("");
      expect(componentInstance.state.value).toEqual("");
    });
    it("Should NOT have a typing timeout set", () => {
      expect(componentInstance.state.typingTimeOut).toEqual(null);
    })
  })
})