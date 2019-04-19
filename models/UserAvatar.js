import mongoose from "mongoose";

const Schema = mongoose.Schema;

//User avatar schema
const UserAvatarSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  path: {
    type: String, 
    required: true
  },
  description: {
    type: String,
    required: false
  },
  uploaded_at: {
    type: Date,
    default: Date.now()
  }
});


export default mongoose.model("UserAvatar", UserAvatarSchema);
