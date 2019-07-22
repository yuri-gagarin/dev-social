import mongoose from "mongoose";
const Schema = mongoose.Schema;

//User Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    retquired: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAvatar"
  },
  role: {
    type: String,
    required: true
  },
  banned: {
    type: Boolean,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  details: {
    ip: {
      type: String
    },
    country: {
      type: String
    },
    countryName: {
      type: String,
    },
    languages: {
      type: String,
    },
    continentCode: {
      type: String,
    },
    timeZone: {
      type: String
    },
    currency: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  }
});
 
export default mongoose.model("User", UserSchema);
