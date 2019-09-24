import React from "react";
import PropTypes from "prop-types";
import {Grid, Container, GridRow} from "semantic-ui-react";
import style from "../../assets/stylesheets/posts/post.scss";
//React components
import PostsNavbar from "./post_navbar/PostsNavbar.jsx";
import PostsContainerComponent from "./PostsContainerComponent.jsx";
import PostSearchComponent from "./posts_sidebar/PostSearchComponent.jsx";
import TrendingPostsComponent from "./posts_sidebar/TrendingPostsComponent.jsx";
//redux imports 
import {connect} from "react-redux";
import {fetchTrendingPosts} from "../../redux/actions/postActions.js";

const PostsIndexComponent = (props) =>{
  const trendingPosts = props.postsState.trendingPosts;
  const fetchTrendingPosts = props.fetchTrendingPosts;
  return (
    <div className={style.postIndexComponent}>
      <Grid>
        <Grid.Row>
          <PostsNavbar />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={12}>
            <PostsContainerComponent />
          </Grid.Column>
          <Grid.Column width={4}>
            <PostSearchComponent />
            <TrendingPostsComponent fetchTrendingPosts={fetchTrendingPosts} trendingPosts={trendingPosts}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
};
PostsIndexComponent.propTypes = {
  postsState: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
  fetchTrendingPosts:  PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    postsState: state.posts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchTrendingPosts: () => dispatch(fetchTrendingPosts()),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(PostsIndexComponent);

