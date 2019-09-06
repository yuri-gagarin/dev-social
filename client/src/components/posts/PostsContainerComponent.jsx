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
  render () {
    const {errorState, clearErrors} = this.props;
    return (
      /*
      <Container style={{marginTop: "100px"}}>
        {
          posts.map((post) => {
            return (
              <PostComponent
                key={post.id}
                title={post.title}

               />
            );
          })
        }
      </Container>
    */
    <Container style={{marginTop: "100px"}}>
      <div style={{marginTop: "200px"}}>POSTS</div>
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
    postsState: state.post, //need to create posts actions and reducer//
    errorState: state.error,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: () => dispatch(fetchPosts()), 
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(PostsContainerComponent);