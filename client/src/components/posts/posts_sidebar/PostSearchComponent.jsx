import React, {Component} from "react";
import PropTypes from "prop-types";
import {Search, Container, Item} from "semantic-ui-react";
import style from "../../../assets/stylesheets/posts/post.scss";

import {setPostImage} from "../../../helpers/rendering/displayHelpers.js";
import axios from "axios";


const ResultRenderer = (props) => {
  return (
    <Item>
      <Item.Image size="tiny" url={setPostImage(props.image)}></Item.Image>
      <Item.Content>
        <Item.Header>{props.title}</Item.Header>
        <Item.Extra>{props.author}</Item.Extra>
      </Item.Content>
    </Item>
  )
};
ResultRenderer.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string,
};

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

  handleSearchChange = (e, {value}) => {
    if (this.state.typingTimeOut) {clearTimeout(this.state.typingTimeOut)};
    const searchTimeout = setTimeout(() => {
      const searchPattern = this.state.value;
      if (this.state.value.length < 3) return;
      this.setState({loading: true}, () => {
        axios({
          method: "get",
          url: "/api/posts/search",
          params: {
            pattern: searchPattern,
          }
        })
        .then((response) => {
          this.setState({
            loading: false,
            message: response.data.message,
            results: [...response.data.searchResults]
          })
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            loading: false,
            message: "Something went wrong",
            results: [],
          })
        });
      })
    }, 2000);
    
    this.setState({
      value: value,
      typingTimeOut: searchTimeout,
      loading: true,
    }, () => {
      if(this.state.value.length < 3) {
        this.setState({loading: false});
      }
    });
  }


  render() {
    return (
      <Container className = {style.postSearchContainer} style={{border: "1px solid green", marginTop: "100px"}} >
        <div className={style.postSearchContainerTitle}>Search Posts</div>
        <Search style={{textAlign: "center"}}
          fluid
          onSearchChange={this.handleSearchChange}
          loading={this.state.loading}
          results={this.state.results}
          resultRenderer={ResultRenderer}
        />
      </Container>
    );
  }
}
export default PostSearchComponent;