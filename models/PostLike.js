import mongoose from "mongoose";
const Schema = mongoose.Schema;

//have to think about additional indexes...
//
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

export default mongoose.model("PostLike", PostLikeSchema);