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
    console.log(this.props.history);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.postsState !== nextProps.postsState;
  }
  render () {
    const posts = this.props.postsState.posts;
    const {authState, errorState} = this.props;
    console.log(posts);
    return (
      <Container style={{marginTop: "100px"}}>
        {
          posts.map((post) => {
            return (
              <PostComponent
                key={post.id}
                title={post.title}
                text={post.text}
                created={post.createdAt}
                edited={post.editedAt}
                likes={post.likes}
                user={post.user}
                slug={post.slug}
                authState={authState}
                errorState={errorState}
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