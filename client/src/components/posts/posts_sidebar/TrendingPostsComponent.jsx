import React, {Component} from 'react';
import PropTypes from "prop-types";

import {Item, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/posts/post.scss";

import {setPostImage} from "../../../helpers/rendering/displayHelpers.js";

//should be most recenetly liked posts or something like that
//should be most recently liked posts or most likes in a certain time period??



const TrendingPost = (props) => {
  const post = props.post;
  return (
    <Item>
      <Item.Image size="small" src={setPostImage(post)}/>
      <Item.Content>
        <Item.Header as="a">{post.title}</Item.Header>
        <Item.Extra>
          <Icon color="red" name="heart"></Icon>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
};

class TrendingPostsComponent extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.fetchTrendingPosts();
  }
  render() {
    console.log(this.props)
    return (
      <div className={style.TrendingPostsComponent}>
        <div>Bitch</div>
        <Item.Group>
          {
            this.props.trendingPosts.map((post) => <TrendingPost key={post._id} post={post} /> )
          }
        </Item.Group>
      </div> 
    );
  }
   
};

TrendingPostsComponent.propTypes = {
  trendingPosts: PropTypes.array.isRequired,
  fetchTrendingPosts: PropTypes.func.isRequired,
};


export default TrendingPostsComponent;
