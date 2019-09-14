import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";

export default {
  createLike: (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    PostLike.findOne({postId: postId}, {userId: userId})
      .then((result) => {
        if (result) {
          return Promise.reject(new Error("Already liked Post"));
        }
        else {
          return PostLike.create({postId: postId, userId: userId});
        }
      })
      .then((response) => {
        return Post.findOneAndUpdate({_id: postId}, {$inc: {likeCount: 1}}, {new: true});
      })
      .then((post) => {
        return res.status(200).json({
          message: "Liked Post",
          post: post,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.message,
          error: error,
        });
      });
  },

  removeLike: (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    PostLike.findOneAndDelete({postId: postId}, {userId: userId})
      .then((deletedLike) => {
        if(deletedLike) {
          return Post.findOneAndUpdate({_id: postId}, {$inc: {likeCount: -1}}, {new: true});
        }
        else {
          return Promise.reject(new Error("No like"));
        }
      })
      .then((post) => {
        return res.status(200).json({
          message: "Unliked a post",
          post: post,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          message: error.message,
          error: error, 
        });
      });
  }
};