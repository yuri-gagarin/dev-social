import React from "react";

import PropTypes from "prop-types";
import {Item, Icon, Grid, Image} from "semantic-ui-react";
import style from "../../assets/stylesheets/posts/post.scss";
import {formatDate} from "../../helpers/rendering/displayHelpers";
import {likePost, unlikePost} from "../../redux/actions/postActions.js" //need to be finished

import {setPostImage} from "../../helpers/rendering/displayHelpers.js";
const PostComponent = (props) => {
  const { authState = {}, post = {}, toggleLike, toggleDislike } = props;
  //should be a function to set the image for the post item or use default from server
  //posts should have images assigned to them
  //should set a post
  const setPost = () => {
    
  };
  const createdAt = formatDate(post.createdAt, {military: false});
  const editedAt = formatDate(post.editedAt, {military: false});
  //blueprint -- not ready

  return (
    <Item className={style.postItem} data-test={"post-component"}>
      <span className={style.postCreated} data-test="post-created-date">Created At: {createdAt}</span>
      <span className={style.postEdited} data-test="post-edited-date">Edited At: {editedAt}</span>
      <Item.Image size="small"style={{border: "3px solid red"}} data-test="default-post-image">
        <div className={style.postImage} style={{backgroundImage: `${setPostImage(post)}`}}></div>
      </Item.Image>
      <Item.Content>
        <Item.Header as="a">{post.title}</Item.Header>
        <Item.Extra>By: {post.author}   <Icon name="user circle" link></Icon></Item.Extra>
        <Item.Description>{post.text}</Item.Description>
        <Item.Extra as="a">More...</Item.Extra>
        <div className="" data-test="like-count"><i></i>{post.likeCount}</div>
        <div className="" data-test="like-post-toggle" onClick={(post) => toggleLike(post) }>Like</div>
        <div className="" data-test="dislike-count"><i></i>{post.dislikeCount}</div>
        <div className="" data-test="dislike-post-toggle" onClick={(post) => toggleDislike(post)}>Dislike</div>
      </Item.Content>
      
    </Item>
    
  );
};

PostComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleDislike: PropTypes.func.isRequired,
};

PostComponent.defaultProps = {
  authState: {},
  post: {},
};



export default PostComponent;