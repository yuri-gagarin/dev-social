import React from "react";

import PropTypes from "prop-types";
import {Item, Icon, Grid} from "semantic-ui-react";

import {likePost, unlikePost} from "../../redux/actions/postActions.js" //need to be finished

/**
 * Trims the text specified to length value.
 * @param {String} text The text to be trimmed.
 * @param {Number} length How many characters should the string be trimmed.
 * @returns {String} The trimmed string appened with <{String}...>.
 */
const trimString = (text, length) => {
  if (typeof text !== "string") {
    throw new TypeError(`Expected the first argument to be a -- 'string' instead saw -- '${typeof text}' ;`);
  }
  if (typeof length !== "number") {
    throw new TypeError(`Expected the second argument to be a -- 'number' instead saw -- '${typeof length}' ;`);
  }
  let trimmed = text.substring(0, length) + "...";
  return trimmed;
};

const PostComponent = (props) => {
  const {authState, postState} = props;
  //should be a function to set the image for the post item or use default from server
  //posts should have images assigned to them
  const setPostImage = () => {
    const imagePath = "/assets/images/posts/tock_post.jpg";
    return imagePath;
  };

  //should set a post
  const setPost = () => {
    
  };
  //blueprint -- not ready
  return (
  <Grid.Column computer={8} tablet={12} mobile={6}>
    <Item>
      <Item.Image size="small" src={setPostImage()}/>
      <Item.Content>
        <Item.Header as="a">{post.title}</Item.Header>
        <Item.Description as="a">{trimString(post.text, 40)}</Item.Description>
      </Item.Content>
      <Item.Content>
        <span>Created At: {post.created}</span>
      </Item.Content>
      <Item.Content>
        <span>Edited At: {post.edited}</span>
      </Item.Content>
      <Item.Content>
        <span>Likes: {post.likes}</span>
      </Item.Content>
      <Item.Content>
        <span>By: {post.author}</span>
      </Item.Content>
    </Item>
  </Grid.Column>
    
  )
};

PostComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  errorState: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  edited: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
};


export default PostComponent;