import {FETCH_TRENDING_POSTS, LIST_ERRORS, POSTS_REQUEST, POSTS_SUCCESS, POSTS_ERROR, HANDLE_POST_LIKE, HANDLE_POST_DISLIKE} from "../cases";
import {trimString} from "../../helpers/rendering/displayHelpers";
import axios from "axios";
import {postSearchOptions} from "../searchOptions";


export const postsRequest = () => {
  return {
    type: POSTS_REQUEST,
    payload: {
      loading: true,
    }
  };
};
export const postsSuccess = (data) => {
  return {
    type: POSTS_SUCCESS,
    payload: {
      message: data.message,
      posts: data.posts,
      loading: false,
    }
  };
};
export const postsError = (error) => {
  return {
    type: POSTS_ERROR,
    payload: {
      message: error.message,
      loading: false,
      error: error,
    }
  };
};

export const fetchPosts = (options={}) => {
  const params = {
    from: options.from || null,
    toDate: options.toDate || null,
    filter: options.filter || postSearchOptions.filter.new,
    limit: options.limit || 10,
  };

  return function(dispatch) {
    dispatch(postsRequest());
    return axios({
      method: "get",
      url: `/api/posts`,
      params: {...params},
    })
    .then((response) => {
      const postState = {
        message: response.data.message,
        posts: response.data.posts,
      };
      return dispatch(postsSuccess(postState));
    })
    .catch((error) => {
      return dispatch(postsError(error));
    });
  }
};


export const fetchTrendingPosts = () => {
  return function(dispatch) {
    axios({
      method: "get",
      url: `/api/posts`,
      params: {
        filter: "trending", 
        limit: 5,
      }
    })
    .then((response) => {
      const trendingPosts = response.data.posts.map((post) => {
        return {
          _id: post._id,
          title: post.title,
          author: post.author,
          likeCount: post.likeCount,
        };
      });
      const trendingPostsState = {
        message: response.data.message,
        trendingPosts: trendingPosts,
      };
      dispatch({
        type: FETCH_TRENDING_POSTS,
        payload: trendingPostsState,
      });
    })
    .catch((error) => {
      dispatch({
        type: LIST_ERRORS,
        payload: error
      });
    });
  }
};

export const handlePostLike = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  if(!token) {
    ///we should return an error if user is not logged in
    console.log("AAAAAAHHHHH")
    return {
      type: POSTS_ERROR,
      payload: "error"
    }
  }
  else {
    return function(dispatch) {
      const options = {
        method: "post",
        url: "/api/posts/like_post/" + postId,
        headers: {"Authorization": `Bearer ${token}`}
      };
      ///api actions
      axios(options)
        .then((response) => {
          let {updatedPost, message} = response.data;
          let newPostState = currentPostState.map((post) => {
            if(post._id === updatedPost._id) {
              return {
                ...post, likeCount: updatedPost.likeCount
              }
            }
            else {
              return post;
            }
          });
          dispatch({
            type: HANDLE_POST_LIKE,
            payload: {
              message: message,
              posts: newPostState,
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: POSTS_ERROR,
            payload: error,
          });
        });
    };
  }
};

export const handlePostDislike = (postId, currentPostState) => {
  const token = localStorage.getItem("jwtToken");
  if(!token) {
    return {
      type: POSTS_ERROR,
      payload: "error"
    }
  }
  else {
    return function(dispatch) {
      const options = {
        method: "post",
        url: "/api/posts/like_post/" + postId,
        headers: {"Authorization": `Bearer ${token}`}
      };
      axios(options)
        .then((response) => {
          let {updatedPost, message} = response.data;
          let newPostState = currentPostState.map((post) => {
            if(post._id === updatedPost._id) {
              return {
                ...post,
                dislikeCount: updatedPost.dislikeCount
              };
            }
            else {
              return post;
            }
          });
          dispatch({
            type: HANDLE_POST_DISLIKE,
            payload: {
              message: message,
              posts: newPostState,
            }
          });
        })
        .catch((error) => {
          dispatch({
            type: POSTS_ERROR,
            payload: error,
          });
        });
    }
  }
};


//downvotes later??
export const downvotePost = (postdId, userId) => {

};
export const removeDownvote = (postId, userId) => {

};
