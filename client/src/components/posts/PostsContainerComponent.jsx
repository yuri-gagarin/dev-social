import React, {Component} from "react";
import PropTypes from "prop-types";
import {Container, Grid, Item} from "semantic-ui-react";
import PostComponent from "./PostComponent.jsx";

import {fetchPosts} from "../../redux/actions/postActions.js";
import {connect} from "react-redux";



//propbably will have a local state as well as redux state
class PostsContainerComponent extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchPosts();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.postsState !== nextProps.postsState;
  }
  render () {
    const posts = this.props.postsState.posts;
    const {authState, errorState} = this.props;
    return (
      <Container style={{marginTop: "100px", border: "3px solid green"}}>
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
  errorState: PropTypes.object.isRequired,
  fetchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    postsState: state.posts,
    errorState: state.error,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: () => dispatch(fetchPosts()), 
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(PostsContainerComponent);