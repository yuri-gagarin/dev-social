import seedDB from "./seedDB.js"
import User from "../../models/User.js";
import {TEST_PASSWORD} from "../seeds/constants.js";
import mongoose from "mongoose";

import {goBackOneDay, goBackOneWeek, goBackOneMonth} from "../helpers/timeHelpers.js";


let firstUser, secondUser, moderator, administrator;
const options = {
  numberOfUsers: 10,
  numberOfPostsPerUser: 5,
  maxCommentsPerPost: 5,
  oneDayAgo: goBackOneDay(),
  oneWeekAgo: goBackOneWeek(),
  oneMonthAgp: goBackOneMonth(),
}
seedDB(options)
  .then((result) => {
    //console.log("Seeded Dev DB");
    ({firstUser, secondUser, moderator, administrator} = result.users);
    return User.findOneAndUpdate({_id: firstUser._id}, {$set: {email: "firstuser@mail.com"}}, {new: true});
  })
  .then((user) => {
    firstUser = {...user.toObject(), password: TEST_PASSWORD};
    //console.log(firstUser);
    return User.findOneAndUpdate({_id: secondUser._id}, {$set: {email: "seconduser@mail.com"}}, {new: true});
  })
  .then((user) => {
    secondUser = {...user.toObject(), password: TEST_PASSWORD};
    return User.findOneAndUpdate({_id: moderator._id}, {$set: {email: "moderator@mail.com"}}, {new: true});
  })
  .then((user) => {
    moderator = {...user.toObject(), password: TEST_PASSWORD};
    return User.findOneAndUpdate({_id: administrator._id}, {$set: {email: "administrator@mail.com"}}, {new: true});
  })
  .then((user) => {
    administrator = {...user.toObject(), password: TEST_PASSWORD};

    //display some login info
    console.log("Created Database.");
    console.log(`First User:
                  email: ${firstUser.email}
                  password: ${firstUser.password}`
                );
    console.log(`Second User: 
                  email: ${secondUser.email}
                  password: ${secondUser.password}`
                );
    console.log(`Moderator:
                  email: ${moderator.email}
                  password: ${moderator.password}`
                );
    console.log(`Administrator: 
                  email: ${administrator.email}
                  password: ${administrator.password}`
                );

    return mongoose.connection.close()
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
  });