import React from "react";
import PostComponent from "../../../src/components/posts/PostComponent";
import {mount, shallow} from "enzyme";
import {formatDate} from "../../../src/helpers/rendering/displayHelpers";
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

  const props = {
    authsState: {},
    post: post,
    toggleLike: likeMock,
    toggleDislike: dislikeMock,
  };
  const wrapper = shallow(<PostComponent {...props} />);


  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toBeDefined();
  });

  /*
  it("should have a method which sets a default post image URL", () => {
    const wrapper = shallow(<PostComponent />);
    console.log(wrapper.instance());
  })
  */
  describe("Component should correctly process a default image", () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<PostComponent  {...props} />);
    });
    it("Should set a default image url if no post images", () => {
      const itemImage = wrapper.find(`[data-test="default-post-image"]`);
      // default image should be set inline
      const itemImageInlineStyle = itemImage.children().at(0).props().style;
      expect(itemImageInlineStyle).toBeDefined();
      expect(itemImageInlineStyle.backgroundImage).toBeDefined();
      expect(typeof itemImageInlineStyle === "string");
    });
    it("Should use a default image if provided", () => {
      const postWithImage = {...post, defaultImage: "wwww.myimageurl.com"};
      wrapper.setProps({post: {...postWithImage} });
      const itemImage = wrapper.find(`[data-test="default-post-image"]`);
      const itemImageInlineStyle = itemImage.children().at(0).props().style;
      expect(itemImageInlineStyle).toBeDefined();
      expect(itemImageInlineStyle.backgroundImage).toBeDefined();
      expect(itemImageInlineStyle.backgroundImage).toEqual(`url(${postWithImage.defaultImage})`);
    });
  });
  describe("The component should correctly process dates", () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<PostComponent {...props} />);
    });

    describe("Component gets passed a valid date string", () => {
      it("Should correctly display createdAt date", () => {
        const postCreatedAt = formatDate(post.createdAt, {military: false});
        const createdDate = wrapper.find(`[data-test="post-created-date"]`).find("span").at(1);
        expect(createdDate.props().children).toEqual(postCreatedAt);
      });
      it("should correctly display the editedAt date", () => {
        const postEditedAt = formatDate(post.editedAt, {military: false});
        const editedDate = wrapper.find(`[data-test="post-edited-date"]`).find("span").at(1);
        expect(editedDate.props().children).toEqual(postEditedAt);
      });
    });
    describe("Component gets passed a null or undefined date", () => {
      beforeAll(() => {
        wrapper.setProps({post: {...post, createdAt: null, editedAt: null}});
      });
      it("Should display an empty string if no createdAt date", () => {
        const postCreatedAt = formatDate(null, {military: false});
        const createdDate = wrapper.find(`[data-test="post-created-date"]`).find("span").at(1);
        expect(createdDate.props().children).toEqual(postCreatedAt);
      });
      it("Should display an empty string if no editedAt date", () => {
        const postEditedAt = formatDate(null, {military: false});
        const editedDate = wrapper.find(`[data-test="post-edited-date"]`).find("span").at(1);
        expect(editedDate.props().children).toEqual(postEditedAt);
      });
    });
  });
  describe("The component should correctly display likes and dislikes", () => {
    it("Should display the correct like count", () => {
      const likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[0]).toEqual(post.likeCount);
    });
    it("Should display the correct dislike count", () => {
      const dislikeCount = wrapper.find(`[data-test="dislike-count"]`);
      expect(dislikeCount.props().children[0]).toEqual(post.dislikeCount);
    });  
  });

  describe("The component should correctly update likePost, dislikePost", () => {
    const wrapper = mount(<PostComponent post={post} toggleLike={likeMock} toggleDislike={dislikeMock} />);

    it("Should like the post and update", () => {
      const likePostBtn = wrapper.find(`[data-test="like-post-toggle"]`);
      let likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[0]).toEqual(post.likeCount);
      //click like post
      likePostBtn.simulate("click");
      const updatedPost = likeMock(post);
      wrapper.setProps({post: updatedPost});
      likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[0]).toEqual(updatedPost.likeCount);
    });
    it("Should dislike the post and update", () => {
      const dislikePostBtn = wrapper.find(`[data-test="dislike-post-toggle"]`);
      let dislikeCount = wrapper.find(`[data-test="dislike-count"]`);
      expect(dislikeCount.props().children[0]).toEqual(post.dislikeCount);
      //click dislike on the post
      dislikePostBtn.simulate("click");
      const updatedPost = dislikeMock(post);
      wrapper.setProps({post: updatedPost});
      dislikeCount = wrapper.find(`[data-test="dislike-count"]`);
      expect(dislikeCount.props().children[0]).toEqual(updatedPost.dislikeCount);
    });
  });

})