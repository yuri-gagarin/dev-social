import mongoose, { mongo } from "mongoose";
import keys from "../../config/keys.js";


import {createUsers} from "../helpers/authHelpers.js";
import {seedPosts, likePosts} from "../helpers/postHelpers.js";
import {seedComments} from "../helpers/commentHelpers.js";
import User from "../../models/User.js";

//mongoose connection function
const connectMongoose = async (mongoURI) => {
  return mongoose.connect(mongoURI, {useNewUrlParser: true, useFindAndModify: false});
};

//seed the DEV DB
/**
 * Seeds the Database
 * @param {object} options - An options object.
 * @param {number} options.numberOfUsers - Number of User(s) to create.
 * @param {number} options.numberOfPostsPerUser - Number of Post(s) tp create. 
 * @param {number} options.maxCommentsPerPost - Maximum number of Comment(s) per Post.
 * @returns {object} An object with {.users} property.
 */
const seedDB = async (options) => {
  try {
    // connect database //
    const connection = await connectMongoose(keys.mongoURI);
    // clear database //
    const response = await mongoose.connection.db.dropDatabase();
    // create some users //
    const usersCreated = await createUsers(options.numberOfUsers);
    // create some posts //
    const postsCreated = await seedPosts(options.numberOfPostsPerUser, usersCreated);
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
        firstUser: usersCreated[0],
        secondUser: usersCreated[1],
        moderator: usersCreated[2],
        administrator: usersCreated[3]
      }
    };
  }
  catch (error) {
    console.error(error);
  }
};

export default seedDB;
