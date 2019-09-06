import React, {Component} from "react";
import PropTypes from "prop-types";
import {Container} from "semantic-ui-react";
import PostComponent from "./PostComponent.jsx";

import {fetchPosts} from "../../redux/actions/postActions.js";
import {connect} from "react-redux";



//propbably will have a local state as well as redux state
class PostsContainerComponent extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("mounted")
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.postsState !== nextProps.postsState;
  }
  render () {
    const posts = this.props.postsState.posts;
    console.log(posts);
    return (
      <Container style={{marginTop: "100px"}}>
        {
          posts.map((post) => {
            return (
              <PostComponent
                key={post.id}
                title={post.name}
                text={post.text}
                created={post.createdAt}
                edited={post.editedAt}
                user={post.user}
                slug={post.slug}
               />
            );
          })
        }
      </Container>
    )
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