import User from "../../models/User.js";
import mongoose from "mongoose";
import keys from "../../config/keys.js";
import bcrypt from "bcrypt";
import {generateUserData} from "../helpers/authHelpers.js";
import {createPost} from "../helpers/postHelpers.js";
import commentsController from "../../controllers/commentsController.js";

let users, testDatabase;

const connectMongoose = async (mongoURI) => {
  return mongoose.connect(mongoURI, {useNewUrlParser: true});
};
/**
 * Creates a specified number of Users.
 * @param {*number} num The number of Users to be created.
 * @returns {Promise} A promise resolves to TRUE if succeeded.
 */
const createUsers = async (num) => {
  users = generateUserData(num);
  for (let i = 0; i < users.length; i++) {
    try {
      let hash = await bcrypt.hash(users[i].password, keys.saltConstant); 
      let user = {...users[i], password: hash};
      let createdUser = await User.create(user);
      users[i]._id = createdUser._id;
    }
    catch(error){
      console.error(error);
      return false;
    }
  }
  return true;
};
const createPosts = async (numOfPosts, user) => {
  const postUser = await User.findOne({email: user.email});
  for (let i = 0; i < numOfPosts; i ++) {
    const post = await createPost(postUser);
  }
  return true;
};

/**
 * Populates Database.
 * @param {null} null No Parameters required.
 * @returns {Promise} A Promise which either resolves to a users object or null;
 */
const seedDB = async () => {
  console.log("Populating Database");
  try {
    // connect test database //
    testDatabase = await connectMongoose(keys.mongoURI);
    await testDatabase.connection.dropDatabase();
    await createUsers(10);
    // create some posts //
    const firstUser = await User.findOne({email: users[0].email});
    const secondUser = await User.findOne({email: users[1].email});
    await createPosts(5, firstUser);
    await createPosts(5, secondUser);  
    // create moderator //
    await User.findOne({email: users[2].email}).then((user) => {
      user.role = "moderator";
      return user.save();
    });
    // create administrator //
    await User.findOne({email: users[3].email}).then((user) => {
      user.role = "administrator";
      return user.save();
    });
    // some other stuff to be added?? //

    return {
      users: {
        firstUser: users[0],
        secondUser: users[1],
        moderator: users[2],
        administrator: users[3],
      },
      testDatabase: testDatabase,
    };
    //process.exit(0);
  }
  catch (error) {
    console.log(error);
    return null;
  }
};



export default seedDB;
