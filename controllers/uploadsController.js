import UserAvatar from "../models/UserAvatar.js";
import User from "../models/User.js";
import deleteFile from "../helpers/APIhelpers/deleteFile.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";

//working upload/update/delete avatar routes
//perhaps refactor later with less nested promises

export default {
  uploadAvatar: async(req, res) => {
    
    const userId = req.user._id;
    //grab a user model with possible avatar
    const user = await User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
    
    if (req.file) {
      //check for an already present avatar so no garbage downloads present
      //theoretically this shouldn't be allowed in the front end
      if(user.avatar) {
        const deletedFile = await deleteFile(req.file.path);
        return res.status(400).json({
          message: "avatar already present",
          file: deletedFile
        });
      }

      const avatarOptions = {};
      if (req.body.description) avatarOptions.description = req.body.description;
      if (req.file.path) avatarOptions.path = req.file.path;
      if (req.user._id) avatarOptions.user = req.user._id;

      //create avatar, update user model
      UserAvatar.create(avatarOptions)
        .then((avatar) => {
          return  User.findOneAndUpdate({_id: userId}, {avatar: avatar._id}, {new: true}).populate("avatar", ["path", "description"]);
        })
        .then((user) => {
          //return a new updated user with avatar
          return res.json({
            message: "Avatar successfully uploaded",
            user: user
          })
        })
        .catch((err) => {
          //catch any possible errors
          return res.status(400).json({
            message: "An error occured",
            errors: err
          });
        }); 
    }
    else {
      // in case no file present
      res.status(400).json({
        message: "You probably should upload a picture"
      });
    }
  },

  //modifying avatar
  modifyAvatar: (req, res) => {

    const userId = req.user._id;
    const avatarOptions = {};

    if (req.body.description) avatarOptions.description = req.body.description;

    // if changing the picture
    // delete old file and upload new one
    if (req.file) {
      if (req.file.path) avatarOptions.path = req.file.path;
      UserAvatar.findOne({user: userId})
      .then((userAvatar) => {
        return deleteFile(userAvatar.path), userAvatar;
      })
      .then((userAvatar) => {
        userAvatar.description = avatarOptions.description;
        userAvatar.path = avatarOptions.path;
        return userAvatar.save();
      })
      .then((userAvatar) => {
        return User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
      })
      .then((user) => {
        return res.json({
          message: "Modified avatar",
          user: user
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
    }
    //else just modifying description
    else {
     UserAvatar.findOne({user: userId})
      .then((userAvatar) => {
        userAvatar.description = avatarOptions.description;
        return userAvatar.save();
      })
      .then((userAvatar) => {
        return User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
      })
      .then((user) => {
        res.json({
          message: "Modified avatar info",
          user: user
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
    }
  },

  deleteAvatar: (req, res) => {
    const userId = req.user._id;
    //find the useravatar model and delete
    UserAvatar.findOneAndDelete({user: userId})
      .then((avatar) => {
        //delete old avatar file
        if (avatar) {
          return deleteFile(avatar.path, avatar);
        }
        else {
          return rejectionPromise("No avatar present");
        }
      })
      .then(() => {
        //update user model
        return User.findOne({_id: userId});
      })
      .then((user) => {
        user.avatar = null;
        return user.save();
      })
      .then((user) => {
        //return updated user model
        console.log(user);
        return res.json({
          message: "Successfully deleted avatar",
          user: user
        });
      })
      
      .catch((err) => {
        console.log("error occured")
        return res.status(400).json({
          message: "An error occured",
          errors: err
        });
      });
      
  }
};