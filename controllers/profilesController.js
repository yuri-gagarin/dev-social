import Profile from "../models/Profile.js";
import User from "../models/User.js";
import mongoose from "mongoose";


export default {
  profile: (req, res) => {
    const currentUser = req.user;
    const errors = {};
    //check for a current user
    if (currentUser) {
      //find the user profile
      Profile.findOne({user: currentUser.id})
        .then((profile) => {
          if (profile) {
            return res.status(200).json({
              message: "profile found"
            });
          }
          else {
            errors.profile = "You have not yet set up a profile";
            return res.status(404).json(errors);
          }
        })
        .catch((err) => {
          return res.status(404).json({err});
        });
    }
    //else if somehow no user present 403
    else {
      return res.status(403).json({
        message: "Not Authorized"
      });
    }
  }
};
