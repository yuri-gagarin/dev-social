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
  render () {
    const posts = this.props.postsState.posts;
    const {authState, errorState} = this.props;
    return (
      <Container style={{border: "3px solid green"}} data-test="posts-container">
        <Item.Group>
          {
            posts.map((post) => {
              return (
                <PostComponent
                  key={post._id}
                  post={post}
                  authState={authState}
                  errorState={errorState}
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