import React from "react";
import {Item, Icon} from "semantic-ui-react";


const Post = (props) => {
  const {authState, postState} = this.props;

  //should be a function to set the image for the post item or use default from server
  //posts should have images assigned to them
  const setPostImage = () => {
    const imagePath = "/assets/images/posts/tock_post.jpg";
    return imagePath;
  };

  //should set a post
  const setPost = () => {
    
  };

  return (
    <Item>
      <Item.Image size="small" src={setPostImage()}/>
      <Item.Content>
        <Item.Header as="a">{"Post Title"}</Item.Header>
        <Item.Description as="a"></Item.Description>
      </Item.Content>
    </Item>
  )
}