import React from "react";

import PropTypes from "prop-types";
import {Item, Icon, Grid} from "semantic-ui-react";
import style from "../../assets/stylesheets/posts/post.scss";
import {likePost, unlikePost} from "../../redux/actions/postActions.js" //need to be finished

/**
 * Trims the text specified to length value.
 * @param {String} text The text to be trimmed.
 * @param {Number} length How many characters should the string be trimmed.
 * @returns {String} The trimmed string appened with <{String}...>.
 */
const trimString = (text, length) => {
  if (typeof text !== "string") {
    throw new TypeError(`Expected the first argument to be a -- {'string'} instead saw -- {'${typeof text}'} ;`);
  }
  if (typeof length !== "number") {
    throw new TypeError(`Expected the second argument to be a -- 'number' instead saw -- '${typeof length}' ;`);
  }
  let trimmed = text.substring(0, length) + "...";
  return trimmed;
};
const PostComponent = (props) => {
  const {authState, postState, post} = props;
  //should be a function to set the image for the post item or use default from server
  //posts should have images assigned to them
  const setPostImage = () => {
    const imagePath = "http://localhost:3000/assets/images/posts/stock_post.jpg";
    return imagePath;
  };

  //should set a post
  const setPost = () => {
    
  };
  //blueprint -- not ready
  return (
    <Item className="postItem">
      <Item.Image size="small" src={setPostImage()}/>
      <Item.Content>
        <Item.Header as="a">Title</Item.Header>
        <Item.Description as="a">{trimString(post.text, 140)}</Item.Description>
      </Item.Content>
      <Item.Content>
        <span>Created At: {post.createdAt}</span>
        <span>Edited At: {post.editedAt}</span>
        <span>Likes: {post.likeCount}</span>
        <span>By: {post.author}</span>
      </Item.Content>
    </Item>
    
  );
};

PostComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  errorState: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  //likePost: PropTypes.func.isRequired,
  //unlikePost: PropTypes.func.isRequired,
};


export default PostComponent;