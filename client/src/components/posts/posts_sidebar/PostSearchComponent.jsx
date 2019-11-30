import React, {Component} from "react";
import {Search, Container, Item} from "semantic-ui-react";
import style from "../../../assets/stylesheets/posts/post.scss";

import {setPostImage} from "../../../helpers/rendering/displayHelpers.js";
import axios from "axios";

const searchPosts = (value) => {
  if (typeof value !== "string" || !value) return Promise.reject("No value");
  const searchParams = {
    method: "get",
    url: "/api/posts/search",
    timeout: 3000,
    params: {
      pattern : value,
    }
  };
  return axios(searchParams);
}
const ResultRenderer = (props) => {
  return (
    <Item data-test="post-search-result">
      <Item.Image size="tiny" url={setPostImage(props.image)}></Item.Image>
      <Item.Content>
        <Item.Header>{props.title}</Item.Header>
        <Item.Extra>{props.author}</Item.Extra>
      </Item.Content>
    </Item>
  )
};
//ResultRenderer.propTypes = {
//  title: PropTypes.string.isRequired,
//  author: PropTypes.string.isRequired,
//  image: PropTypes.string,
//};

class PostSearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      results: [],
      message: "",
      value: "",
      typingTimeOut: null,
    };
  }

  componentDidMount = () => {
    //console.log(this.state);
  }

  
  handleSearchChange = (e, {value}) => {
    if (this.state.typingTimeOut) {clearTimeout(this.state.typingTimeOut)};
    this.setState({
      value: value,
      loading: false,
      typingTimeOut: this.typingTimeOut(),
    });
  };

  typingTimeOut = () => {
    console.log("setting timout")
    return setTimeout(() => {
      console.log("firing timout")
      this.setState({loading: true}, () => {
        this.setSearchResults();        
      });
    }, 2000);
  };

  setSearchResults = () => {
    return searchPosts(this.state.value)
      .then((response) => {
        this.setState({
          message: response.data.message || "Search results",
          results: [...response.data.posts],
          loading: false,
        });
      })
      .catch((error) => {
        console.log(84)
        this.setState({
          message: error.message,
          results: [],
          loading: false,
        });
      });
  };


  render() {
    return (
      <Container className={style.postSearchContainer} data-test="post-search-component">
        <div className={style.postSearchContainerTitle}>Search Posts</div>
        <Search 
          style={{textAlign: "center"} }
          fluid
          onSearchChange={this.handleSearchChange}
          loading={this.state.loading}
          results={this.state.results}
          resultRenderer={ResultRenderer}
          data-test="post-search-input"
        />
      </Container>
    );
  }
}
export default PostSearchComponent;