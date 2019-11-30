import React, {Component} from "react";
import PropTypes from "prop-types";
import {Container, Grid, Item} from "semantic-ui-react";
import PostComponent from "./PostComponent.jsx";

//propbably will have a local state as well as redux state
class PostsContainerComponent extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const options = {
      limit: 10
    }
    this.props.fetchPosts();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.postsState !== nextProps.postsState;
  }
  handlePostLike = (id) => {
    //console.log(id)
    const currentPosts = this.props.postsState.posts;
    this.props.toggleLike(id, currentPosts);
  };
  handlePostDislike = (id) => {
    const currentPosts = this.props.postsState.posts;
    this.props.toggleDislike(id, currentPosts);
  }
  render () {
    const posts = this.props.postsState.posts;
    const {authState, errorState} = this.props;
    return (
      <Container data-test="posts-container">
        <Item.Group>
          {
            posts.map((post) => {
              const postId = post._id;
              return (
                <PostComponent
                  key={post._id}
                  post={post}
                  authState={authState}
                  //errorState={errorState}
                  toggleLike={() => this.handlePostLike(postId)}
                  toggleDislike={() => this.handlePostDislike(postId)}
                />
              );
            })
          }
        </Item.Group>
      </Container>
    );
  }
};

PostsContainerComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  postsState: PropTypes.object.isRequired,
  fetchPosts: PropTypes.func.isRequired,
};

export default PostsContainerComponent;