process.env.NODE_ENV = "test";
import axios from "axios";
import User from "../../models/User.js";
import mongoose from "mongoose";
import keys from "../../config/keys.js";
import Post from "../../models/Post.js";
import bcrypt from "bcrypt";
import {generateUserData} from "../helpers/authHelpers.js";
let connected = false;
mongoose.connect(keys.mongoURI, {useNewUrlParser: true}).catch(err => console.error(err));

const users = generateUserData(10);
console.log(users);
for (let i = 0; i < users.length; i++) {
  bcrypt.hash(users[i].password, keys.saltConstant, function(err, hash) {
    let user = {...users[i], password: hash};
    User.create(user)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
  });
};


