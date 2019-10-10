import mongoose from "mongoose";
const Schema = mongoose.Schema;

//have to think about additional indexes...
//
const PostDislikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("PostDislike", PostDislikeSchema);