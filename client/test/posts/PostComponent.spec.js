import React from "react";
import PostComponent from "../../src/components/posts/PostComponent";
import {mount, shallow} from "enzyme";
import faker from "faker";

describe("PostComponent tests", () => {
  const post = {
    title: faker.lorem.word(),
    text: faker.lorem.paragraph(2),
    author: faker.name.firstName(1),
    createdAt: faker.date.past(1).toString(),
    editedAt: faker.date.recent(1).toString(),
    defaultImage: "",
    likeCount: 1,
    dislikeCount: 0,
  };

  it("renders the component", () => {
    const wrapper = shallow(<PostComponent />);
    expect(wrapper).toBeDefined();
    expect(wrapper.html()).toBeDefined();
  });
  it("Should have default props if none passed to it", () => {
    const wrapper = mount(<PostComponent />);
    expect(wrapper).toBeDefined();
    expect(wrapper.props().authState).toEqual({});
    expect(wrapper.props().post).toEqual({});
  });

  /*
  it("should have a method which sets a default post image URL", () => {
    const wrapper = shallow(<PostComponent />);
    console.log(wrapper.instance());
  })
  */
  it("Should set a default image url if no post images", () => {
    const wrapper = shallow(<PostComponent  post={post}/>);
    const itemImage = wrapper.find(`[data-test="default-post-image"]`);
    // default image should be set inline
    const itemImageInlineStyle = itemImage.children().at(0).props().style;
    expect(itemImageInlineStyle).toBeDefined();
    expect(itemImageInlineStyle.backgroundImage).toBeDefined();
    expect(typeof itemImageInlineStyle === "string");
  })
  it("Should use a default image if provided", () => {

  })
})