import React, {Component} from "react";
import PropTypes from "prop-types";
import {Container} from "semantic-ui-react";
import PostComponent from "./PostComponent.jsx";
import axios from "axios";

import {connect} from "react-redux";

const fetchPosts = (options={}) => {
  const sortOption = options.sortOption || "new";
  const fetchLimit = options.fetchLimit || 10;
  axios({
    method: "GET",
    url: `/api/posts/${sortOption}`,
    data: {
      fetchLimit: fetchLimit,
    }
  })
    .then((response) => {
      const postState = {
        message: response.message,
        posts: response.posts,
      };
      return postState;
    })
    .catch((error) => {
      const postState = {
        message: error.message,
      }
      return postState;
    });
};

//propbably will have a local state as well as redux state
class PostsContainerComponent extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const posts = this.props.posts; //should be fetched from API
    return (
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
    );
  }
};

PostsContainerComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  postsState: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  fetchPosts: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    postsState: state.posts, //need to create posts actions and reducer//
    errors: state.errors,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: dispatch(fetchPosts()), //needs creating
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(PostsContainerComponent);