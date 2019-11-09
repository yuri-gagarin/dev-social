import React from "react";

import PropTypes from "prop-types";
import {Item, Icon, Grid, Image} from "semantic-ui-react";
import style from "../../assets/stylesheets/posts/post.scss";
import {likePost, unlikePost} from "../../redux/actions/postActions.js" //need to be finished

import {setPostImage} from "../../helpers/rendering/displayHelpers.js";
const PostComponent = (props) => {
  const { authState = {}, post = {} } = props;
  //should be a function to set the image for the post item or use default from server
  //posts should have images assigned to them
  //should set a post
  const setPost = () => {
    
  };
  //blueprint -- not ready
  return (
    <Item className={style.postItem} data-test={"post-component"}>
      <span className={style.postCreated}>Created At: {post.createdAt}</span>
      <span className={style.postEdited}>Edited At: {post.editedAt}</span>
      <Item.Image size="small"style={{border: "3px solid red"}} data-test="default-post-image">
        <div className={style.postImage} style={{backgroundImage: `${setPostImage(post)}`}}></div>
      </Item.Image>
      <Item.Content>
        <Item.Header as="a">{post.title}</Item.Header>
        <Item.Extra>By: {post.author}   <Icon name="user circle" link></Icon></Item.Extra>
        <Item.Description>{post.text}</Item.Description>
        <Item.Extra as="a">More...</Item.Extra>
        <span>Likes: {post.likeCount}</span>
      </Item.Content>
      
    </Item>
    
  );
};

PostComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  //likePost: PropTypes.func.isRequired,
  //unlikePost: PropTypes.func.isRequired,
};

PostComponent.defaultProps = {
  authState: {},
  post: {},
};



export default PostComponent;