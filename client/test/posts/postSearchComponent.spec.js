import React from "react";
import { shallow, mount } from "enzyme";

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
    });

    describe("{PostSearchComponent} search input", () => {
      let  mountedSearch, searchInput;
      beforeAll(() => {
        mountedSearch = mount(<PostSearchComponent />);
        searchInput = setElem(mountedSearch, "post-search-input");

      })
      it("Should have an {onSearchChange} function defined in props", () => {
        expect(searchInput.at(0).props().onSearchChange).toBeDefined();
        expect(typeof searchInput.at(0).props().onSearchChange).toEqual("function");
      });
      describe("{PostSearchComponent} {handleSearchChange} function", () => {
        it("Handle searchChange call should change the component state", () =>{
          //searchInput.props().onSearchChange();
          const searchComponent = mountedSearch.find("Search");
          const postSearchComponent = mountedSearch.find("PostSearchComponent");
          postSearchComponent.instance().setState({value: "Search me"});
          searchComponent.instance().setState({value: "Search me"});
          wrapper.update();
          jest.useFakeTimers();
          const newSearchComponent = mountedSearch.find("Search");
          newSearchComponent.invoke("onSearchChange")({}, {value: "Searching"});
          jest.runAllTimers();
  
          //console.log(newSearchComponent.instance());
        });
      
      })
    })
  })
})