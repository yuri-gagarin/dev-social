import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostLikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  }
});

export default mongoose.model("Like", PostLikeSchema);