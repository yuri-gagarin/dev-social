import Post from "../models/Post.js";

export default {

  createComment: (req, res) => {

    const userId = req.user._id;
    const postId = req.query.postId;
    //grab a post
    Post.findOne({_id: postId})
      .then((post) => {
        return new Promise((resolve, reject) => {
          if(post) {
            //build a comment
            let newComment = {
              user: userId,
              text: req.body.text,
              name: req.body.name || "anonymous"
            };
            //push a comment to post, resolve promise
            post.comments.push(newComment);
            resolve(post.save())
          }
          else {
            reject("no post found")
          }
        })
      })
      .then((post) => {
        //return updated post
        return res.json({
          message: "Comment Saved",
          post: post
        })
      })
      .catch((err) => {
        //catch any errors
        return res.status(400).json({
          message: "request error",
          errors: err
        });
      });
  }
 
}