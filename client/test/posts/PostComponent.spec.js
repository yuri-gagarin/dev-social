import React from "react";
import PostComponent from "../../src/components/posts/PostComponent";
import {mount, shallow} from "enzyme";
import {formatDate} from "../../src/helpers/rendering/displayHelpers";
import faker from "faker";

describe("PostComponent tests", () => {
  const post = {
    title: faker.lorem.word(),
    text: faker.lorem.paragraph(2),
    author: faker.name.firstName(1),
    createdAt: faker.date.past(1).toISOString(),
    editedAt: faker.date.recent(1).toISOString(),
    defaultImage: "",
    likeCount: 1,
    dislikeCount: 0,
  };
  const likeMock = (post) => {
    post.likeCount += 1;
    return post;
  };
  const dislikeMock = (post) => {
    post.dislikeCount += 1;
    return post;
  }

  it("renders the component", () => {
    const wrapper = shallow(<PostComponent toggleLike={likeMock} toggleDislike={dislikeMock}/>);
    expect(wrapper).toBeDefined();
    expect(wrapper.html()).toBeDefined();
  });
  it("Should have default props if none passed to it", () => {
    const wrapper = mount(<PostComponent toggleLike={likeMock} toggleDislike={dislikeMock}/>);
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
  describe("Component should correctly process a default image", () => {
    it("Should set a default image url if no post images", () => {
      const wrapper = shallow(<PostComponent  post={post} toggleLike={likeMock} toggleDislike={dislikeMock}/>);
      const itemImage = wrapper.find(`[data-test="default-post-image"]`);
      // default image should be set inline
      const itemImageInlineStyle = itemImage.children().at(0).props().style;
      expect(itemImageInlineStyle).toBeDefined();
      expect(itemImageInlineStyle.backgroundImage).toBeDefined();
      expect(typeof itemImageInlineStyle === "string");
    });
    it("Should use a default image if provided", () => {
      let postWithImage = {...post, defaultImage: "wwww.myimageurl.com"};
      const wrapper = shallow(<PostComponent post={postWithImage} toggleLike={likeMock} toggleDislike={dislikeMock} />)
      const itemImage = wrapper.find(`[data-test="default-post-image"]`);
      const itemImageInlineStyle = itemImage.children().at(0).props().style;
      expect(itemImageInlineStyle).toBeDefined();
      expect(itemImageInlineStyle.backgroundImage).toBeDefined();
      expect(itemImageInlineStyle.backgroundImage).toEqual(`url(${postWithImage.defaultImage})`);
    });
  });
  describe("The component should correctly process dates", () => {
    it("Should correctly display createdAt date", () => {
      const wrapper = shallow(<PostComponent post={post} toggleLike={likeMock} toggleDislike={dislikeMock} />);
      const postCreatedAt = formatDate(post.createdAt, {military: false});
      const createdDate = wrapper.find(`[data-test="post-created-date"]`);
      expect(createdDate.props().children[1]).toEqual(postCreatedAt);
    });
    it("should correctly display the editedAt date", () => {
      const wrapper= shallow(<PostComponent post={post}toggleLike={likeMock} toggleDislike={dislikeMock}  />);
      const postEditedAt = formatDate(post.editedAt, {military: false});
      const editedDate = wrapper.find(`[data-test="post-edited-date"]`);
      expect(editedDate.props().children[1]).toEqual(postEditedAt);
    });
    it("Should display an empty string if no createdAt date", () => {
      const wrapper = shallow(<PostComponent post={{...post, createdAt: null}} toggleLike={likeMock} toggleDislike={dislikeMock}/>);
      const postCreatedAt = formatDate(null, {military: false});
      const createdDate = wrapper.find(`[data-test="post-created-date"]`);
      expect(createdDate.props().children[1]).toEqual(postCreatedAt);
    });
    it("Should display an empty string if no editedAt date", () => {
      const wrapper = shallow(<PostComponent post={{...post, editedAt: null}} toggleLike={likeMock} toggleDislike={dislikeMock} />);
      const postEditedAt = formatDate(null, {military: false});
      const editedDate = wrapper.find(`[data-test="post-edited-date"]`);
      expect(editedDate.props().children[1]).toEqual(postEditedAt);
    });
  });
  describe("It should correctly display likes and dislikes", () => {

  })
  describe("It should correctly update likePost, dislikePost", () => {
    
    it("Should like the post and update", () => {
      const wrapper = mount(<PostComponent post={post} toggleLike={likeMock} toggleDislike={dislikeMock} />);
      const likePostBtn = wrapper.find(`[data-test="like-post-toggle"]`);

      let likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[1]).toEqual(post.likeCount);
      //click like post
      likePostBtn.simulate("click");
      const updatedPost = likeMock(post);
      wrapper.setProps({post: updatedPost});
      likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[1]).toEqual(updatedPost.likeCount);

    })
  })
})