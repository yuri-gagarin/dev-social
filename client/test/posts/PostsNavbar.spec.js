import React from "react";
import PostsNavbar from "../../src/components/posts/post_navbar/PostsNavbar";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import { Menu, Dropdown } from "semantic-ui-react";
import { postSearchOptions } from "../../src/redux/searchOptions";

describe("PostNavbar Tests", function() {
  const mockFetchPosts = (options) => {
    return {
      posts: "some posts"
    }
  };
  const authState = {
    loggedIn: true,
  };
  const component = renderer.create(<PostsNavbar/>);
  let tree = component.toJSON();
  test("Component renders", () => {
   // expect(tree).toMatchSnapshot();
  });
  it("renders the component", () => {
    const wrapper = shallow(<PostsNavbar fetchPosts={mockFetchPosts}/>);
  });
  it("has a Menu component", () => {
    const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts}/>);
    expect(wrapper.find(Menu).length).toEqual(1)
  });
  it("has two Dropdown components", () => {
    const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts}/>);
    expect(wrapper.find(Dropdown).length).toEqual(2);
  });
  it("Accepts an {authState} props object", () => {
    const wrapper = mount(<PostsNavbar  authState={authState} fetchPosts={mockFetchPosts}/>)
    expect(wrapper.props().authState).toEqual(authState);
  });
  it("sets the default state", () => {
    const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts}/>);
    expect(wrapper.state().filter).toEqual(postSearchOptions.filter.new);
    expect(wrapper.state().from).toEqual(postSearchOptions.time.day);
    expect(wrapper.state().filterBarEnabled).toEqual(true);
    expect(wrapper.state().timeBarEnabled).toEqual(false);
  });

  it("successfully changes filter state", () => {
    const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts}/>);
    const filterDropdown = wrapper.find(`[data-test="nav-filter"]`);
    const filterOptions = filterDropdown.find(".item");
    filterOptions.forEach((node) => {
      //console.log(node.prop('data-value'));
      node.simulate('click');
      expect(wrapper.state().filter).toEqual(node.prop("data-value"));
      //console.log(wrapper.state().filter);
    });
  });

  it("does NOT activate the time filter option if fetching {new} || {trending}", () => {
    const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts} />);
    const filterDropdown = wrapper.find(`[data-test="nav-filter"]`);
    const filterOptions = filterDropdown.find(".item");
    filterOptions.forEach((node) => {
      const clickValue = node.prop("data-value");
      node.simulate("click");
      if(clickValue === postSearchOptions.filter.new || clickValue === postSearchOptions.filter.trending) {
        expect(wrapper.state().timeBarEnabled).toEqual(false);
        expect(wrapper.state().from).toEqual(postSearchOptions.time.none);
      }
    });
  });
  it("activates the time filter option if fetching (discussed} || {controversial}", () => {
    const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts} />);
    const filterDropdown = wrapper.find(`[dta-test="nav-filter"]`);
    const filterOptions = filterDropdown.find(".item");
    filterOptions.forEach((node) => {
      const clickValue = node.prop("data-value");
      node.simulate("click");
      if(clickValue === postSearchOptions.filter.discussed || clickValue === postSearchOptions.filter.controversial) {
        expect(wrapper.state().timeBarEnabled).toEqual(true);
        expect(wrapper.state().from).toEqual(postSearchOptions.time.day);
      }
    });
  });

})