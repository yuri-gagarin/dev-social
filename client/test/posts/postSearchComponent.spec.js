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
    it("Should have a {this.handleSearchChange} function defined", () => {
      expect(componentInstance.handleSearchChange).toBeDefined();
      expect(typeof componentInstance.handleSearchChange).toEqual("function");
    });
    it("Should have a {this.typingTimout} function defined", () => {
      expect(componentInstance.typingTimeOut).toBeDefined();
      expect(typeof componentInstance.typingTimeOut).toEqual("function");
    });
    it("Should hava a {this.setSearchResults} function defined", () => {
      expect(componentInstance.setSearchResults).toBeDefined();
      expect(typeof componentInstance.setSearchResults).toEqual("function");
    });

    describe("{PostSearchComponent} search input", () => {
      let  mountedSearch, searchInput;
      const expectedResults = [{_id: 1, key: 1, title: "A"}, {_id: 2, key: 2, title: "B"}];
      beforeAll(() => {
        mountedSearch = mount(<PostSearchComponent />);
        searchInput = mountedSearch.find("Search");

      });
      it("Should have an {onSearchChange} function defined in props", () => {
        expect(searchInput.props().onSearchChange).toBeDefined();
        expect(typeof searchInput.props().onSearchChange).toEqual("function");
      });
      describe("{PostSearchComponent} {handleSearchChange} function", () => {
        beforeEach(() => {
          moxios.install();
        });
        afterEach(() => {
          moxios.uninstall();
        })
        it("{this.onSearchChange} call should change the component state", () =>{
          moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
              status: 200,
              response: {
                message: "success",
                searchResults: expectedResults,
              }
            });
          });
          //mock a valid search input
          //change the state of search component
          const searchComponent = mountedSearch.find("Search");
          const postSearchComponent = mountedSearch.find("PostSearchComponent");
          postSearchComponent.instance().setState({value: "Search me"});
          searchComponent.instance().setState({value: "Search me"});
          wrapper.update();
          //our functions have timoouts, clear them
          jest.useFakeTimers();
          const newSearchComponent = mountedSearch.find("Search");
          newSearchComponent.invoke("onSearchChange")({}, {value: "Searching"});
          jest.runAllTimers();
          //the final {this.setSearchResults} is a promise, we test that in next test
          //since we are not waiting for the promise the end state should equal the execution of {this.typingTimeout}
          expect(mountedSearch.instance().state.loading).toBe(true);
          expect(mountedSearch.instance().state.results).toEqual([]);
          //console.log(newSearchComponent.instance());
        });
        it("{this.setSearchResults} function should set the correct state", () => {
          moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
              status: 200,
              response: {
                message: "Posts",
                searchResults: expectedResults,
              }
            });
          });
          
          return mountedSearch.instance().setSearchResults()
            .then(() =>{
              mountedSearch.update();
              expect(mountedSearch.instance().state.results).toEqual(expectedResults);
              expect(mountedSearch.instance().state.loading).toBe(false);
            });
        });
        it("Should render the correct amount of {Item} components in search results", () => {
          const searchResults = mountedSearch.find("Item");
          expect(searchResults.length).toEqual(expectedResults.length);
        })
        it("Should have two children components", () => {
          const searchResults = mountedSearch.find("Item");
          for (let item of searchResults) {
            expect(item.props.children.length).toEqual(2);
          }
        });
      })
    })
  })
})