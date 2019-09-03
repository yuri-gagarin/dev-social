import React, {Component} from "react";

import {Container} from "semantic-ui-react";

import axios from "axios";

import connect from "react-redux";

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

class PostsComponent extends Component {

  

  render () {
    return (
      <Container style={{marginTop: "100px"}}>
        <p>Posts Here</p>
      </Container>
    );
  }
};

export default PostsComponent;