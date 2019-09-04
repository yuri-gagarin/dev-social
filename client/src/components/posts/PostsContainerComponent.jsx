import React, {Component} from "react";
import PropTypes from "prop-types";
import {Container} from "semantic-ui-react";
import PostComponent from "./PostComponent.jsx";

import {fetchPosts} from "../../redux/actions/postActions.js";
import {clearErrors} from "../../redux/actions/errorActions.js";
import {connect} from "react-redux";
import displayErrorMessage from "../../helpers/displayErrorMessage.js";



//propbably will have a local state as well as redux state
class PostsContainerComponent extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props);
    this.props.fetchPosts();
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
      {displayErrorMessage(errorState, clearErrors)}
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
  clearErrors: PropTypes.func.isRequired,
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
    fetchPosts: () => dispatch(fetchPosts()), //needs creating
    clearErrors: () => dispatch(clearErrors()),
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(PostsContainerComponent);