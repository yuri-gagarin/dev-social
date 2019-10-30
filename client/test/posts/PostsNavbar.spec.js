import React from "react";
import PostsNavbar from "../../src/components/posts/post_navbar/PostsNavbar";
import configureMockStore from  "redux-mock-store";
import thunk from "redux-thunk";
import * as postActions from "../../src/redux/actions/postActions";
import fetchMock from "fetch-mock";

import renderer from "react-test-renderer";

describe("PostNavbar test", function() {
  const component = renderer.create(<PostsNavbar/>);
  let tree = component.toJSON();
  test("Component renders", () => {
    expect(tree).toMatchSnapshot();
  });

  describe("PostNavbar actions", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it("Successfully fetches Post(s)", () => {
      fetchMock.getOnce("/api/posts", {

      })

    })
  })
})