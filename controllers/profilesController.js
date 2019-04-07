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
  },
  createProfile: (req, res) => {
    const errors = {};
    const user = req.user._id;
    const profileData = {
      user: user._id,
      social: {}
    };
    //all the validations
    //there has to be a neater way to do this...
    if (req.body.handle) profileData.handle = req.body.handle;
    if (req.body.company) profileData.company = req.body.company;
    if (req.body.website) profileData.website = req.body.website;
    if (req.body.location) profileData.location = req.body.location;
    if (req.body.status) profileData.status = req.body.status;
    if (req.body.bio) profileData.bio = req.body.bio;
    if (req.body.githubUserName) profileData.githubUserName = req.body.githubUserName;
    //skills arrray
    if (typeof req.body.skills !== "undefined") {
      let skillData = req.body.skills.split(",");
      let skillDataTrimmed = [];
      //remove whitespace if any
      skillDataTrimmed = skillData.map((word) => {
        return word.trim();
      });
      //set the skills
      profileData.skills = skillDataTrimmed;
    }
    //social
    if (req.body.youtube) profileData.social.youtube = req.body.youtube;
    if (req.body.facebook) profileData.social.facebook = req.body.facebook;
    if (req.body.instagram) profileData.social.instagram = req.body.instagram;
    if (req.body.twitter) profileData.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileData.social.linkedin = req.body.linkedin;

    //find user profile if there is on
    Profile.findOne({ user: user._id })
      .then((profile) => {
        if (profile) {
          //update profile
          Profile.findOneAndUpdate(
            { user: user._id }, 
            { $set: profileData},
            { new: true }
          )
          .then((profile) => {
            return res.json(profile);
          })
          .catch((err) => {
            console.log(err);
          });
        }
        else {
          //create profile
          //check if handle is already taken
          Profile.findOne({ handle: profileData.handle })
            .then((profile) => {
              if (profile) {
                errors.handle = "Handle already exists";
                res.status(400).json(errors);
              }
              else {
                //create and save profile
                new Profile(profileData).save()
                  .then((profile) => {
                    return res.json(profile);
                  })
              }
            });
        }
      });
  }
};
