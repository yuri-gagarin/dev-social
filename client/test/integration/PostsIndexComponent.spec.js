import React from "react";
import PostsIndexComponent from "../../src/components/posts/PostsIndexComponent"

import {mount} from "enzyme";

import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

import store from "../../src/redux/store";
import { setElem } from "../helpers/helperFunctions";


describe("PostsIndexComponent Integration tests", () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <PostsIndexComponent />
        </Router>
      </Provider>
    );
  });
  it("Should render a {PostsIndexComponent}", () => {
    const postsIndexComponent = setElem(wrapper, "posts-index-component");
    expect(postsIndexComponent.exists()).toBe(true);
  });
  it("Shoudl render a {PostsNavbarComponent}", () => {
    const postsNavbar = setElem(wrapper, "posts-navbar");
    expect(postsNavbar.exists()).toBe(true);
  });
 
  it("Should render a {PostSearchComponent}", () => {
    const postSearchComponent = setElem(wrapper, "post-search-component");
    expect(postSearchComponent.exists()).toBe(true);
  });
  it("Should render a {TrendingPostsComponent}", () => {
    const trendinPostsComponent = setElem(wrapper, "trending-posts-component");
    expect(trendinPostsComponent.exists()).toBe(true);
  });
  describe("{PostsContainerComponent} rendering", () => {
    let postsContainerComponent, expectedPostsState, expectedAuthState;
    beforeAll(() => {
      postsContainerComponent = wrapper.find("PostsContainerComponent");
      expectedAuthState = store.getState().authState;
      expectedPostsState = store.getState().postsState;
    })
    it("Should render a {PostsContainerComponent}", () => {
      expect(postsContainerComponent.exists()).toBe(true);
    });
    it("Should pass a {postsState} prop", () => {
      expect(postsContainerComponent.props().postsState).toEqual(expectedPostsState);
    });
    it("Should pass a {authState} prop", () => {
      expect(postsContainerComponent.props().authState).toEqual(expectedAuthState);
    });
  });
  describe("{PostSearchComponent} rendering", () => {
    let postSearchComponent;
    beforeAll(() => {
      postSearchComponent = wrapper.find("PostSearchComponent");
    });
    it("Should render a {PostSearchComponent}", () => {
      expect(postSearchComponent.exists()).toBe(true);
    });
  })
  describe("{TrendingPostsComponent} rendering", () => {
    let trendingPostsComponent, expectedPostsState, expectedAuthState;
    beforeAll(() => {
      trendingPostsComponent = wrapper.find("TrendingPostsComponent");
      expectedPostsState = store.getState().postsState.trendingPosts;
    });
    it("Should render a {TrendingPostsComponent}", () => {
      expect(trendingPostsComponent.exists()).toBe(true);
    });
    it("should passs a {fetchTrendingPosts} function", () => {
      expect(typeof trendingPostsComponent.props().fetchTrendingPosts).toEqual("function");
    });


  });
});
