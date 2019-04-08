import Profile from "../models/Profile.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import profileValidator from "../helpers/profileValidator.js";



export default {

  getProfileByHandle: (req, res) => {
    //get handle from params
    const handle = req.params.handle;
    if (handle) {
      //if a handle present
      //attempt to find a profile with that handle
      Profile.findOne({ handle: handle })
      .populate("user", ["name", "email"])
      .then((profile) => {
        if (profile) {
          return res.json({
            message: `Profile for user: ${profile.user.name}`,
            profile: profile
          });
        }
        else {
          return res.status(404).json({
            message: "Not Found",
            profile: "User has not created a profile"
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error",
          errors: err
        });
      });
    }
  },

  getProfileByID: (req, res) => {
    //profile by userID
    const userId = req.params.user_id;
    if (userId) {
      //if a userID is sent to params
      //attempt to find profile by userId
      Profile.findOne({ user: userId })
      .populate("user", ["name", "email"])
      .then((profile) => {
        if (profile) {
          return res.json({
            message: `Profile for user: ${profile.user.name}`,
            profile: profile
          });
        }
        else {
          return res.status(404).json({
            message: "Not Found",
            profile: "This user doesn't seem to have a profile"
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error",
          errors: err
        });
      });
    }
  },

  allProfiles: (req, res) => {
    const allProfiles = [];
    Profile.find({})
    .then((profiles) => {
      if (profiles) {
        profiles.forEach((profile) => {
          allProfiles.push(profile);
        });
        if (allProfiles.length > 0) {
          return res.json({
            message: "List of profiles",
            profiles: allProfiles
          });
        }
        else {
          return res.json({
            message: "There doesn't seem to be any profiles created"
          })
        }
      }
    })
    .catch((err) => {
       return res.status(400).json({
        message: "Error",
        errors: err
      })
    });
  },

  profile: (req, res) => {
    const currentUser = req.user;
    const errors = {};
    //check for a current user
    if (currentUser) {
      //find the user profile
      Profile.findOne({user: currentUser.id})
        .populate("user", ["name", "email"])
        .then((profile) => {
          if (profile) {
            return res.status(200).json({
              message: "profile found",
              profile
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

  saveProfile: (req, res) => {
    //validate for bad input first
    //required field
    const { errors, isValid } = profileValidator(req.body);
    if (!isValid) {
      errors.message = "Invalid request";
      errors.isValid = isValid;
      return res.status(400).json(errors);
    }
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
    console.log("Line 72");
    console.log(profileData);
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
            console.log("updated");
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
                  .catch((err) => {
                    return res.status(400).json(err);
                  });
              }
            });
        }
      });
  },

  deleteProfile: (req, res) => {
    //find the user 
    //add later admin user delete privileges
    const user = req.user;
    Profile.findOne({ user: user })
      .then((profile) => {
        //see if actually found a profile
        if(profile) {
          Profile.deleteOne({ user: user })
          .then((response) => { 
            return res.json(response);
          })
          //catch a delete error
          .catch((err) => {
            return res.status(400).json({
              message: "Error deleting",
              errors: err
            });
          })
        }
      })
      //catch any other database error
      .catch((err) => {
        return res.status(400).json({
          message: "Error Processing Request",
          errors: err 
        })
      });
  }

};
