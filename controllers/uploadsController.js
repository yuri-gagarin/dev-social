import UserAvatar from "../models/UserAvatar.js";
import User from "../models/User.js";
import deleteFile from "../helpers/APIhelpers/deleteFile.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";
import avatarUploader from "../uploaders/avatarUploader.js";
//working upload/update/delete avatar routes
//perhaps refactor later with less nested promises

export default {
  uploadAvatar: async(req, res) => {
    const userId = req.user._id;
    //grab a user model with possible avatars
    try {
      let user = await User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
     
      if (req.file) {
        //get avatar options
        const avatarOptions = {};
        if (req.body.description) avatarOptions.description = req.body.description || "";
        if (req.file.path) avatarOptions.path = req.file.path;
        if (req.user._id) avatarOptions.user = req.user._id;

        //check for an already present avatar so no garbage download and database entries present
        //theoretically this shouldn't be allowed in the front end
        if(user.avatar) {
          let deletedFile = await deleteFile(user.avatar.path);
          let deletedAvatar = await UserAvatar.deleteOne({_id: user.avatar._id});
          let newAvatar = await UserAvatar.create(avatarOptions);
          let updatedUserWithAvatar = await User.findOneAndUpdate(
            {_id: userId},
            {avatar: newAvatar._id},
            {new: true}
          ).populate("avatar", ["path", "description"]);
          //assuming everything went smooth
          return res.json({
            message: "Old avatar deleted, new avatar uploaded",
            user: updatedUserWithAvatar
          });
        }
        else {
          let newAvatar = await UserAvatar.create(avatarOptions);
          let updatedUserWithAvatar = await User.findOneAndUpdate(
            {_id: userId},
            {avatar: newAvatar._id},
            {new: true}
          ).populate("avatar", ["path", "description"]);
          return res.json({
            message: "New user avatatar uploaded ",
            user: updatedUserWithAvatar
          });
        }
        //end if(user.avatar)s
      }
      //else req.file is empty user should link a file
      else {
        res.status(400).json({
          message: "You should upload a file"
        })
      }
    }
    catch(error) {
      console.error(error);
      return res.status(400).json({
        message: "An error occured processing the avatar",
        error: error.message
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