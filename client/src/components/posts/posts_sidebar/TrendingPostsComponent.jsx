import React, {Component} from 'react';
import PropTypes from "prop-types";

import {Item, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/posts/post.scss";

import {setPostImage} from "../../../helpers/rendering/displayHelpers.js";

//should be most recenetly liked posts or something like that
//should be most recently liked posts or most likes in a certain time period??



const TrendingPost = (props) => {
  const {post, openAuthor, openPost} = props;
  return (
    <Item className={style.trendingPost}>
      <Item.Image size="tiny" src={setPostImage(post)}/>
      <Item.Content>
        <Item.Header as="a" onClick={() => openAuthor(post)}>{post.title}</Item.Header>
        <Item.Extra>
          <Icon name="heart"></Icon>
          {post.likeCount}
        </Item.Extra>
        <Item.Description as="a" onClick={() => openPost(post)}>
          <span>by: {post.author}</span>
        </Item.Description>
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
  openAuthor = (arg) => {
    console.log(arg);
  }
  openPost = (post) => {
    console.log(post);
  }
  render() {
    return (
      <div className={style.trendingPostsComponent}>
        <div className={style.headerDiv}>Trending Now</div>
        <Item.Group>
          {
            this.props.trendingPosts.map((post) => {
              return <TrendingPost key={post._id} 
                                   post={post}
                                   openAuthor={this.openAuthor}
                                   openPost={this.openPost} 
                      /> 
            })
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

TrendingPost.propTypes= {
  post: PropTypes.object.isRequired,
  openAuthor: PropTypes.func.isRequired,
  openPost: PropTypes.func.isRequired,
};



export default TrendingPostsComponent;
