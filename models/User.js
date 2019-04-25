import mongoose from "mongoose";
const Schema = mongoose.Schema;

//User Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAvatar"
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});
 
export default mongoose.model("User", UserSchema);
