import mongoose from "mongoose";
import keys from "../../config/keys.js";
// models //
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import PostLike from "../../models/PostLike.js";
import Comment from "../../models/Comment.js";


import {createUsers} from "../helpers/authHelpers.js";
import {createPost, seedPosts} from "../helpers/postHelpers.js";

let users, testDatabase;
//mongoose connection function
const connectMongoose = async (mongoURI) => {
  return mongoose.connect(mongoURI, {useNewUrlParser: true});
};
//create some users


//create some posts


//like some posts


//create some comments

//options
const options = {
  numberOfUsers: 10,
  numberOfPosts: 10,
  numberOfComments: 10,
}
//seed the DEV DB
/**
 * Seeds a development database.
 * @param {object} options An options object.
 * @returns {Promise} A Promise which resolves to True or False.
 */
const seedDevDB = async (options) => {
  try {
    // connect database //
    const connection = await connectMongoose(keys.mongoURI);
    // create some users //
    const usersCreated = await createUsers(options.numberOfUsers);
    // create some posts //
    const postsCreated = await seedPosts(10, usersCreated);
    // create some comments //
    const commentsCreated = await seedComments(posts, users);
  }
  catch (error) {
    console.error(error);
  }
};

seedDevDB(options);