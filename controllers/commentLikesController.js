import Post from "../models/Post";

export default {
  createLike: (req, res) => {
    const postId = req.body.postId;
    Post.findOne({_id: postId})
    .then((post) => {
      return res.json(post);
    })
    .catch((err) => {
      return res.status(400).json({
        message: "an error occured",
        errors: err
      });
    });
  },
  deleteLike: (req, res) => {

  }
}