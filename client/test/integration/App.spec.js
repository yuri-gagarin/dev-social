import React from "react";
import App from "../../src/App";

import {mount} from "enzyme";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import store from "../../src/redux/store";


describe("Full mount App tests", () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    );
  })
  describe("User is Logged in", () => {
    it("Should render", () => {
      console.log("yah")
      const postsIndexComponent = wrapper.find("PostsIndexComponent");
      console.log(postsIndexComponent.exists());
      //console.log(wrapper.debug())
    })
  });
  describe("User NOT Logged in", () => {

  });
})