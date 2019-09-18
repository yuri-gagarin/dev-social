import mongoose, { MongooseDocument } from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],
  likeCount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Comment", CommentSchema);