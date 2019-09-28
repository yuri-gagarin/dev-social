import mongoose, { mongo } from "mongoose";
import keys from "../../config/keys.js";

import User from "../../models/User.js";
import Post from "../../models/User.js";
import PostLike from "../../models/PostLike.js";
import Comment from "../../models/Comment.js";

import {createUsers} from "../helpers/authHelpers.js";
import {seedPosts, likePosts} from "../helpers/postHelpers.js";
import {seedComments} from "../helpers/commentHelpers.js";

import {withinOneDay, withinOneWeek, withinOneMonth, withinOneYear} from "../helpers/timeHelpers.js";

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
 * @param {Date} options.oneDayAgo- Last day Date object (optional).
 * @param {Date} options.oneWeekAgo - Last week Date object (optional).
 * @param {Date} options.oneMonthAgo - Last month Date object (optional).
 * @param {Date} options.oneYearAgo = Last year Date object (optional).
 * @returns {object} An object with {.users} property.
 */
const seedDB = async (options) => {
  let complete = false;
  try {
    console.log("Starting and connecting to Database");
    // connect database //
    const connection = await connectMongoose(keys.mongoURI);
    console.log(`Connected to Database: ${mongoose.connection.db.databaseName}`);
    // clear database //
    console.log(`Cleaning Database : ${mongoose.connection.db.databaseName}`);
    const response = await mongoose.connection.db.dropDatabase();
    console.log("Finished");
    // create some users //
    console.log("Creating Users");
    const usersCreated = await createUsers(options.numberOfUsers);
    console.log(`Created ${usersCreated.length} Users`);
    // create some day old posts //
    if(options.oneDayAgo) {
      console.log("Creating one day old Posts, Comments, Likes");
      const dayOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, options.oneDayAgo);
      const postLikes = await likePosts(dayOldPosts, usersCreated, withinOneDay);
      const postComments = await seedComments(usersCreated, dayOldPosts, options.maxCommentsPerPost, withinOneDay);
      console.log("Finished");
    }
    // create some week old posts //
    if (options.oneWeekAgo) {
      console.log("Creating one week old Posts, Comments, Likes");
      const weekOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, options.oneWeekAgo);
      const postLikes = await likePosts(weekOldPosts, usersCreated, withinOneWeek);
      const postComments = await seedComments(usersCreated, weekOldPosts, options.maxCommentsPerPost, withinOneWeek)
      console.log("Finished");
    }
    // create some month old posts //
    if (options.oneMonthAgo) {
      console.log("Creating one month old Posts, Comments, Likes ");
      const monthOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, options.oneMonthAgo);
      const postLikes = await likePosts(monthOldPosts, usersCreated, withinOneMonth);
      const postComments = await seedComments(usersCreated, monthOldPosts, options.maxCommentsPerPost, withinOneMonth);
      console.log("Finished");
    }
    // creat some year old posts //
    if (options.oneYearAgo) {
      console.log("Creating one year old Posts, Comments, Likes");
      const yearOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, options.oneYearAgo);
      const postLikes = await likePosts(yearOldPosts, usersCreated, withinOneYear);
      const postComments = await seedComments(usersCreated, yearOldPosts, options.maxCommentsPerPost, withinOneYear);
      console.log("Finished");
    }
    // if no  specific date options //
    if(!options.oneDayAgo && !options.oneWeekAgo && !options.oneMonthAgo && !options.oneYearAgo) {
      console.log("Creating Posts, Comments, Likes")
      const posts = await seedPosts(options.numberOfPostsPerUser, usersCreated);
      const postLikes = await likePosts(posts, usersCreated);
      const postComments = await seedComments(usersCreated, posts, options.maxCommentsPerPost);
      console.log("Finished");
    }
   
    // create a moderator //
    console.log("Setting User roles");
    console.log("Setting a Moderator");
    const moderator = await User.findOneAndUpdate({_id: usersCreated[2]._id}, {$set: {role: "moderator"} });
    // create an administrator //
    const administrator = await User.findOneAndUpdate({_id: usersCreated[3]._id}, {$set: {role: "administrator"} });
    console.log("Finished");
    const numberOfUsers = await User.countDocuments({});
    const numberOfPosts = await  Post.countDocuments({});
    const numberOfComments = await Comment.countDocuments({});
    const numberOfPostLikes = await PostLike.countDocuments({});

    console.log(`Created: \n${numberOfUsers}: User(s) \n${numberOfPosts}: Post(s) \n${numberOfComments}: Comment(s) \n${numberOfPostLikes}: PostLike(s)` )
     
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
