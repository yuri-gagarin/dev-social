import PostDislike from "../models/PostDislike.js";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import postLikes from "../routes/postLikes.js";


export default {
  addPostDislike: (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    let editedPost;
    let responseCode;
    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          //check if user liked a Post
          //if liked remove Like and add a Dislike
          editedPost = post;
          return PostLike.findOne({postId: postId, userId: userId});
        }
        else {
          responseCode = 400;
          return Promise.reject(new Error("No Post found"));
        }
      })
      .then((postLike) => {
        if(postLike) {
          //Post was liked, remove it first
          PostLike.deleteOne({postId: postId, userId: userId})
            .then((response) => {
              if(response.ok && response.deletedCount === 1) {
                editedPost.likeCount -= 1;
                return Promise.resolve(true);
              }
              else {
                responseCode = 500;
                return Promise.reject("Something went wrong");
              }
            })
            .catch((error) => console.error(error));
        }
        else {
          //Post was not liked, continue
          return Promise.resolve(true);
        }
      })
      .then((response) => {
        //check if a Post is already disliked
        return PostDislike.findOne({postId: postId, userId: userId})
      })
      .then((postDislike) => {
        //user already disliked the post 
        if (postDislike) {
          responseCode = 400;
          return Promise.reject(new Error("Already disliked the Post"));
        }
        else {
          return PostDislike.create({postId: postId, userId: userId});
        }
      })
      .then((newDislike) => {
        editedPost.dislikeCount += 1;
        return editedPost.save()
      })
      .then((post) => {
        responseCode = 200;
        return res.status(responseCode).json({
          message: "Disliked the Post",
          post: {
            id: post._id,
            likeCount: post.likeCount,
            dislikeCount: post.dislikeCount,
          }
        });
      })
      .catch((error) => {
        return res.status(responseCode||500).json({
          message: "Seems something went wrong",
          error: error,
        })
      });
  },
  removePostDislike: (req, res) => {

  },
};
