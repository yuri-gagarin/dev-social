import React from "react";
import PostsNavbar from "../../src/components/posts/post_navbar/PostsNavbar";
import renderer from "react-test-renderer";

describe("PostNavbar test", function() {
  const component = renderer.create(<PostsNavbar/>);
  let tree = component.toJSON();
  test("Component renders", () => {
    expect(tree).toMatchSnapshot();
  });
})