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
    describe("Componet gets passed a valid date string", () => {
      const wrapper = shallow(<PostComponent post={post} toggleLike={likeMock} toggleDislike={dislikeMock} />);
      it("Should correctly display createdAt date", () => {
        const postCreatedAt = formatDate(post.createdAt, {military: false});
        const createdDate = wrapper.find(`[data-test="post-created-date"]`);
        expect(createdDate.props().children[1]).toEqual(postCreatedAt);
      });
      it("should correctly display the editedAt date", () => {
        const postEditedAt = formatDate(post.editedAt, {military: false});
        const editedDate = wrapper.find(`[data-test="post-edited-date"]`);
        expect(editedDate.props().children[1]).toEqual(postEditedAt);
      });
    });
    describe("Component gets passed a null or undefined date", () => {
      const wrapper = shallow(<PostComponent post={{...post, createdAt: null, editedAt: null}} 
                              toggleLike={likeMock} toggleDislike={dislikeMock} />);
      it("Should display an empty string if no createdAt date", () => {
        const postCreatedAt = formatDate(null, {military: false});
        const createdDate = wrapper.find(`[data-test="post-created-date"]`);
        expect(createdDate.props().children[1]).toEqual(postCreatedAt);
      });
      it("Should display an empty string if no editedAt date", () => {
        const postEditedAt = formatDate(null, {military: false});
        const editedDate = wrapper.find(`[data-test="post-edited-date"]`);
        expect(editedDate.props().children[1]).toEqual(postEditedAt);
      });
    });
  });
  describe("The component should correctly display likes and dislikes", () => {
    const wrapper = shallow(<PostComponent post={post} toggleLike={likeMock} toggleDislike={dislikeMock} />);
    it("Should display the correct like count", () => {
      const likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[1]).toEqual(post.likeCount);
    });
    it("Should display the correct dislike count", () => {
      const dislikeCount = wrapper.find(`[data-test="dislike-count"]`);
      expect(dislikeCount.props().children[1]).toEqual(post.dislikeCount);
    });  
  });

  describe("The component should correctly update likePost, dislikePost", () => {
    const wrapper = mount(<PostComponent post={post} toggleLike={likeMock} toggleDislike={dislikeMock} />);

    it("Should like the post and update", () => {
      const likePostBtn = wrapper.find(`[data-test="like-post-toggle"]`);
      let likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[1]).toEqual(post.likeCount);
      //click like post
      likePostBtn.simulate("click");
      const updatedPost = likeMock(post);
      wrapper.setProps({post: updatedPost});
      likeCount = wrapper.find(`[data-test="like-count"]`);
      expect(likeCount.props().children[1]).toEqual(updatedPost.likeCount);
    });
    it("Should dislike the post and update", () => {
      const dislikePostBtn = wrapper.find(`[data-test="dislike-post-toggle"]`);
      let dislikeCount = wrapper.find(`[data-test="dislike-count"]`);
      expect(dislikeCount.props().children[1]).toEqual(post.dislikeCount);
      //click dislike on the post
      dislikePostBtn.simulate("click");
      const updatedPost = dislikeMock(post);
      wrapper.setProps({post: updatedPost});
      dislikeCount = wrapper.find(`[data-test="dislike-count"]`);
      expect(dislikeCount.props().children[1]).toEqual(updatedPost.dislikeCount);
    });
  });

})