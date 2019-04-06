import mongoose from "mongoose";

const Schema = mongoose.Schema;

//profile Schema
const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  githubUserName: {
    type: String,
    required: false
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date,
        required: false
      },
      current: {
        type: Boolean,
        required: true,
        default: false
      },
      description: {
        type: String,
        required: false
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true 
      },
      to: {
        type: Date,
        required: false
      },
      current: {
        type: Boolean,
        required: true,
        default: false
      },
    }
  ],
  social: {
    youtube: {
      type: String,
      required: false
    },
    facebook: {
      type: String,
      required: false
    },
    instagram: {
      type: String,
      required: false
    },
    twitter: {
      type: String,
      required: false
    },
    linkedin: {
      type: String, 
      required: false
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Profile", ProfileSchema);