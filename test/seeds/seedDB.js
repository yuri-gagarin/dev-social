import mongoose, { mongo } from "mongoose";
import keys from "../../config/keys.js";

import User from "../../models/User.js";
import Post from "../../models/User.js";
import PostLike from "../../models/PostLike.js";
import Comment from "../../models/Comment.js";

import {createUsers} from "../helpers/authHelpers.js";
import {seedPosts, likePosts} from "../helpers/postHelpers.js";
import {seedComments} from "../helpers/commentHelpers.js";

import {withinOneDay, withinOneWeek, withinOneMonth, withinOneYear, withinTimeConstraint} from "../../helpers/timeHelpers.js";

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
 * @param {boolean} options.withinADay - If True will seed Post(s) created within 24hrs. 
 * @param {boolean} options.withinAWeek - If True will seed Post(s) created within 7 days.
 * @param {boolean} options.withinAMonth - If True will seed Post(s) created within 30 days.options.
 * @param {boolean} options.withinAYear - If True will seed Post(s) created within 1 year.
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
    // create some recent posts //
    if(options.withinADay) {
      console.log("Creating some new Posts, Comments, Likes");
      const newPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, withinOneDay);
      const postLikes = await likePosts(newPosts, usersCreated, withinTimeConstraint);
      const postComments = await seedComments(usersCreated, newPosts, options.maxCommentsPerPost, withinTimeConstraint);
      console.log("Finished");
    }
    // create some week old posts //
    if (options.withinAWeek) {
      console.log("Creating one week old Posts, Comments, Likes");
      const weekOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, withinOneWeek);
      const postLikes = await likePosts(weekOldPosts, usersCreated, withinTimeConstraint);
      const postComments = await seedComments(usersCreated, weekOldPosts, options.maxCommentsPerPost, withinTimeConstraint)
      console.log("Finished");
    }
    // create some month old posts //
    if (options.withinAMonth) {
      console.log("Creating one month old Posts, Comments, Likes ");
      const monthOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, withinOneMonth);
      const postLikes = await likePosts(monthOldPosts, usersCreated, withinOneMonth);
      const postComments = await seedComments(usersCreated, monthOldPosts, options.maxCommentsPerPost, withinTimeConstraint);
      console.log("Finished");
    }
    // creat some year old posts //
    if (options.withinAYear) {
      console.log("Creating one year old Posts, Comments, Likes");
      const yearOldPosts = await seedPosts(options.numberOfPostsPerUser, usersCreated, withinOneYear);
      const postLikes = await likePosts(yearOldPosts, usersCreated, withinTimeConstraint);
      const postComments = await seedComments(usersCreated, yearOldPosts, options.maxCommentsPerPost,withinTimeConstraint);
      console.log("Finished");
    }
    // if no  specific date options //
    if(!options.withinADay && !options.withinAWeek && !options.withinAMonth && !options.withinAYear) {
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
    const numberOfComments = await Comment.countDocuments({});
    const numberOfPostLikes = await PostLike.countDocuments({});
    const numberOfPosts = await Post.countDocuments({});
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
