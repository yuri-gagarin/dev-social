import React from "react";

import {Search, Container} from "semantic-ui-react";
import style from "../../../assets/stylesheets/posts/post.scss";

const PostSearchComponent = (props) => {

  return (
    <Container className = {style.postSearchContainer} style={{border: "1px solid green", marginTop: "100px"}} >
      <div className={style.postSearchContainerTitle}>Search Posts</div>
      <Search>
      </Search>
    </Container>
  )
}
export default PostSearchComponent;