import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String
  },
  avatar: {
    type: String
  },
  likeCount: {
    type: Number,
    required: true,
    default: 0
  },
  comments: [
    { 
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  commentCount: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Post", PostSchema);
