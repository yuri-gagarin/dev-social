import React from "react";
import PostsNavbar from "../../src/components/posts/post_navbar/PostsNavbar";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import { Menu, Dropdown } from "semantic-ui-react";

describe("PostNavbar test", function() {
  const component = renderer.create(<PostsNavbar/>);
  let tree = component.toJSON();
  test("Component renders", () => {
    expect(tree).toMatchSnapshot();
  });
  it("renders the component", () => {
    const wrapper = shallow(<PostsNavbar />);
  });
  it("has a Menu component", () => {
    const wrapper = mount(<PostsNavbar />);
    console.log(wrapper.find(Menu).length);
    expect(wrapper.find(Menu).length).toEqual(1)
  });
  it("has two Dropdown components", () => {
    const wrapper = mount(<PostsNavbar />);
    expect(wrapper.find(Dropdown).length).toEqual(2);
  });
  it("sets the default state", () => {
    const wrapper = mount(<PostsNavbar />);
    expect(wrapper.state("filter")).toEqual("new");
  });

})