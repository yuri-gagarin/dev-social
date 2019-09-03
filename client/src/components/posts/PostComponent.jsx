import React from "react";

import PropTypes from "prop-types";
import {Item, Icon, Grid} from "semantic-ui-react";

import {likePost, unlikePost} from "../../redux/actions/postActions.js" //need to be finished


const PostComponent = (props) => {
  const {authState, postState} = props;
  const {name, text, user, createdAt} = props.post;
  let postLikesCount = props.post.likes;
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
  <Grid.Column computer={8} tablet={12} mobile={6}>
    <Item>
      <Item.Image size="small" src={setPostImage()}/>
      <Item.Content>
        <Item.Header as="a">{"Post Title"}</Item.Header>
        <Item.Description as="a"></Item.Description>
      </Item.Content>
    </Item>
  </Grid.Column>
    
  )
};

PostComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  postLikesCount: PropTypes.number.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
};


export default PostComponent;