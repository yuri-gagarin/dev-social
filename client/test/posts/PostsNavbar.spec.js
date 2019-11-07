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
  it("renders the component", () => {
    const wrapper = shallow(<PostsNavbar />);
  });
  it("has a Menu component", () => {
    const wrapper = shallow(<PostsNavbar />);
    expect(wrapper.find(Menu).length).toEqual(1)
  });
  it("has two Dropdown components", () => {
    const wrapper = shallow(<PostsNavbar />);
    expect(wrapper.find(Dropdown).length).toEqual(2);
  });
  it("Accepts an {authState} props object", () => {
    const wrapper = mount(<PostsNavbar  authState={authState} fetchPosts={mockFetchPosts}/>)
    expect(wrapper.props().authState).toEqual(authState);
  });
  it("sets the default state", () => {
    const wrapper = shallow(<PostsNavbar />);
    expect(wrapper.state().filter).toEqual(postSearchOptions.filter.new);
    expect(wrapper.state().from).toEqual(postSearchOptions.time.day);
    expect(wrapper.state().filterBarEnabled).toEqual(true);
    expect(wrapper.state().timeBarEnabled).toEqual(false);
  });
  it("{Dropdown} component disabled property is {true} by default", () => {
    const wrapper = shallow(<PostsNavbar fetchPosts={mockFetchPosts} />);
    const timeDropdown = wrapper.find(`[data-test="post-time-filter"]`);
    expect(timeDropdown.props().disabled).toEqual(true);
  });
  it("successfully sets the {Dropdown} component {disabled} prop", () => {
    const wrapper = shallow(<PostsNavbar fetchPosts={mockFetchPosts} />);
    wrapper.setState({timeBarEnabled: true});
    const timeDropdown = wrapper.find(`[data-test="post-time-filter"]`);
    expect(timeDropdown.props().disabled).toEqual(false);
  });
  // dropddown filter tests //
  describe("{Dropdown} component - filter options", () => {
    let wrapper, filterDropdown, filterOptions;
    beforeAll(() => {
      wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts}/>);
      filterDropdown = wrapper.find(`[data-test="nav-filter"]`);
      filterOptions = filterDropdown.find(".item");
    });
    it("Should be defined", () => {
      expect(filterDropdown).toBeDefined();
    });
    it("Should have 4 filter options", () => {
      expect(filterOptions.length).toEqual(4);
    });
    it("successfully changes filter state", () => {
      filterOptions.forEach((node) => {
        node.simulate('click');
        expect(wrapper.state().filter).toEqual(node.prop("data-value"));
      });
    });
    it("does NOT activate the time filter option if fetching {new} || {trending}", () => {
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
      filterOptions.forEach((node) => {
        const clickValue = node.prop("data-value");
        node.simulate("click");
        if(clickValue === postSearchOptions.filter.discussed || clickValue === postSearchOptions.filter.controversial) {
          expect(wrapper.state().timeBarEnabled).toEqual(true);
          expect(wrapper.state().from).toEqual(postSearchOptions.time.day);
        }
      });
    });
    it("successfully sets the {Dropdown} component {disabled} prop", () => {
      const timeDropdownComponent = wrapper.find(`[data-test="post-time-filter"]`);
      filterOptions.forEach((node) => {
        const clickValue = node.prop("data-value");
        node.simulate("click");
        if(clickValue === postSearchOptions.filter.discussed || clickValue === postSearchOptions.filter.controversial) {
          console.log(timeDropdownComponent.props());
        }
      });
    });
  })
  // end dropddown filter tests //
  /*
  describe("{Dropdown} component - time options", () => {
    let wrapper, timeDropdown, timeOptions;
    before("Mount the component", () => {
      wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts}/>);
      timeDropdown = wrapper.find(`[data-test="post-time-filter"]`);
      timeOptions = timeDropdown.find(".item");
    });
    it("Should be defined", () => {
      expect(timeDropdown).toBeDefinded();
    });
    it("Should have 5 time options", () => {
      expect(timeOptions.length).toEqual(5);
    })
    it("successfully sets the time filter", () => {
      const wrapper = mount(<PostsNavbar fetchPosts={mockFetchPosts} />);
      const timeDropdown = wrapper.find(`[data-test="post-time-filter"]`);
      const timeOptions = timeDropdown.find(".item");
      expect(timeOptions.length).toEqual(5);
      timeOptions.forEach((node) => {
        const clickValue = node.prop("data-value");
        node.simulate("click");
        expect(wrapper.state().from).toEqual(clickValue);
      });
    });
  });
  */
});
