import Post from "../models/Post.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";

export default {
  createLike: (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    Post.findOne({_id: postId})
      .then((post) => {
        if(post) {
          //loop post likes
          //if user already liked break out early and reject
          let likesLength = post.likes.length;
          for (let i = 0; i < likesLength; i++) {
            if (post.likes[i].user.equals(userId)) {
              return rejectionPromise("Already Liked!");
            }
          }
          post.likes.push({user: userId});
          return post.save();

        }
        //in case no such post
        else {
          return rejectionPromise("No post found");
        }
      })
      .then((post) => {
        return res.json({
          message: "Liked",
          likeCount: post.likes.length
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
  },

  removeLike: (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    console.log(postId)

    Post.findOne({_id: postId})
      .then((post) => {
        if (post) {
          //find index of a like
          //if like exists, set the index break the loop early
          let removeIndex = -1;
          let likesLength = post.likes.length;
          for (let i = 0; i < likesLength; i++) {
            if (post.likes[i].user.equals(userId)) {
              removeIndex = i;
              break;
            }
          }
          //if like exists remove like from post and save()          
          if (removeIndex > -1) {
            post.likes.splice(removeIndex, 1);
            return post.save();
          }
          else {
            return rejectionPromise("No like");
          }
          
        }
        else {
          return rejectionPromise("No Post Found");
        }
      })
      .then((post) => {
        return res.json({
          message: "Unliked",
          likeCount: post.likes.length
        });
      })
      //catch all
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
  }
};