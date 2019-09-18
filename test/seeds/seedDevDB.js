import mongoose from "mongoose";
import keys from "../../config/keys.js";


import {createUsers} from "../helpers/authHelpers.js";
import {seedPosts, likePosts} from "../helpers/postHelpers.js";
import {seedComments} from "../helpers/commentHelpers.js";
import User from "../../models/User.js";

//mongoose connection function
const connectMongoose = async (mongoURI) => {
  return mongoose.connect(mongoURI, {useNewUrlParser: true, useFindAndModify: false});
};

//options
//set some options here
const options = {
  numberOfUsers: 10,
  numberOfPosts: 10,
  maxCommentsPerPost: 10,
}
//seed the DEV DB
const seedDevDB = async (options) => {
  try {
    // connect database //
    const connection = await connectMongoose(keys.mongoURI);
    // create some users //
    const usersCreated = await createUsers(options.numberOfUsers);
    // create some posts //
    const postsCreated = await seedPosts(options.numberOfPosts, usersCreated);
    // create some comments //
    const commentsCreated = await seedComments(usersCreated, postsCreated, options.maxCommentsPerPost);
    // like some posts //
    const postLikes = await likePosts(postsCreated, usersCreated);
    // create a moderator //
    const moderator = await User.findOneAndUpdate({_id: usersCreated[2]._id}, {$set: {role: "moderator"} });
    // create an administrator //
    const administrator = await User.findOneAndUpdate({_id: usersCreated[3]._id}, {$set: {role: "administrator"} });

    return {
      users: {
        firstUser: createUsers[0],
        secondUser: createUsers[1],
        moderator: createUsers[2],
        administrator: createUsers[3]
      }
    };
  }
  catch (error) {
    console.error(error);
  }
};

seedDevDB(options)
  .catch(err => console.error(error));