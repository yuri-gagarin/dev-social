import React, {Component} from "react";

import {Search, Container} from "semantic-ui-react";
import style from "../../../assets/stylesheets/posts/post.scss";

import axios from "axios";

//ok we should have a dynamic, case insensitive search for posts based by title?
class PostSearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      results: [],
      value: "",
      isTyping: true,
      typingTimeOut: null,
    };
    
  }
  handleSearchChange = (e, {value}) => {
    if (this.state.typingTimeOut) {clearTimeout(this.state.typingTimeOut)};
    const searchTimeout = setTimeout(() => {
      const searchPattern = this.state.value;
      axios({
        method: "get",
        url: "/api/posts/search",
        data: {
          searchPattern: searchPattern
        }
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });
    }, 2000);
    this.setState({
      value: value,
      typingTimeOut: searchTimeout,
      loading: true,
    });
  }


  render() {
    return (
      <Container className = {style.postSearchContainer} style={{border: "1px solid green", marginTop: "100px"}} >
        <div className={style.postSearchContainerTitle}>Search Posts</div>
        <Search 
          onSearchChange={this.handleSearchChange}
          loading={this.state.loading}
          minCharacters={3}
        />
      </Container>
    );
  }
}
export default PostSearchComponent;