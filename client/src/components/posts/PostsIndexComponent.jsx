import React from "react";
import PropTypes from "prop-types";
import {Grid} from "semantic-ui-react";
import style from "../../assets/stylesheets/posts/post.scss";
//React components
import PostsNavbar from "./post_navbar/PostsNavbar.jsx";
import PostsContainerComponent from "./PostsContainerComponent.jsx";
import PostSearchComponent from "./posts_sidebar/PostSearchComponent.jsx";
import TrendingPostsComponent from "./posts_sidebar/TrendingPostsComponent.jsx";
//redux imports 
import {connect} from "react-redux";
import {fetchPosts, fetchTrendingPosts, handlePostLike, handlePostDislike} from "../../redux/actions/postActions.js";

const PostsIndexComponent = (props) => {
  const {authState, postsState} = props;
  const {fetchPosts, fetchTrendingPosts, toggleLike, toggleDislike} = props;
  const trendingPosts = props.postsState.trendingPosts;
    
  return (
    <div className={style.postIndexComponent} data-test="posts-index-component">
      <Grid>
        <Grid.Row>
          <PostsNavbar fetchPosts={fetchPosts}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={12}>
            <PostsContainerComponent 
              authState={authState}
              postsState={postsState}
              fetchPosts={fetchPosts}
              toggleLike={toggleLike}
              toggleDislike={toggleDislike}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <PostSearchComponent />
            <TrendingPostsComponent 
              fetchTrendingPosts={fetchTrendingPosts} 
              trendingPosts={trendingPosts}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
};
PostsIndexComponent.propTypes = {
  postsState: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
  fetchTrendingPosts: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleDislike: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    authState: state.authState,
    postsState: state.postsState,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchTrendingPosts: () => dispatch(fetchTrendingPosts()),
    fetchPosts: (options) => dispatch(fetchPosts(options)),
    toggleLike: (postId, currentPostState) => dispatch(handlePostLike(postId, currentPostState)),
    toggleDislike: (postId, currentPostState) => dispatch(handlePostDislike(postId, currentPostState))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(PostsIndexComponent);

