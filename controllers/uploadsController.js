import UserAvatar from "../models/UserAvatar.js";
import User from "../models/User.js";
import deleteFile from "../helpers/APIhelpers/deleteFile.js";
import handleAvatarUploadError from "./controller_helpers/handleAvatarUploadError.js";

//working upload/update/delete avatar routes
export default {
  uploadAvatar: async(req, res) => {
    const userId = req.user._id;
    //grab a user model with possible exxisting avatar
    try {
      let user = await User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
    
      if (req.file) {
        //get avatar options
        const avatarOptions = {
          description: req.body.description ? req.body.description : "Eureka!",
          path: req.file.path,
          user: req.user._id
        };
        //check for an already present avatar
        //theoretically this shouldn't be allowed in the front end
        if(user.avatar) {
          //delete an old file if present
          const deletedFile = await deleteFile(user.avatar.path);
          //set new avatar parameters for the user
          user.avatar.path = avatarOptions.path;
          user.avatar.description = avatarOptions.description;
          //update UserAvatar model and User
          const updatedAvatar = await UserAvatar.findOneAndReplace({user: user._id}, avatarOptions);
          let  updatedUser = await user.save();
          updatedUser = await updatedUser.populate("avatar", ["path", "description"]);

          return res.json({
            message: "Successfully uploaded a new avatar",
            user: {
              name: updatedUser.name,
              email: updatedUser.email,
              avatar: {
                path: updatedUser.avatar.path,
                description: updatedUser.avatar.description
              }
            }
          });
        }
        else {
          //else no previous avatar present
          const newAvatar = await UserAvatar.create(avatarOptions);
          const updatedUserWithAvatar = await User.findOneAndUpdate(
            {_id: userId},
            {avatar: newAvatar._id},
            {new: true}
          ).populate("avatar", ["path", "description"]);
          return res.json({
            message: "New user avatatar uploaded ",
            user: updatedUserWithAvatar
          });
        }
      }
      else {
        //else req.file is empty user should link a file
        res.status(400).json({
          message: "You should upload a file"
        })
      }
    }
    catch(error) {
      //some possible errors
      console.error(error);
      //check for a successful upload with multer. remove if a controller error occured
      let avatarUpload = req.locals.avatarUpload;
      if(avatarUpload && avatarUpload.success) {
        //if error in the controller but multer uploaded file - remove the file
        return handleAvatarUploadError(avatarUpload.avatarPath, res, error);
      }
      else {
        //else multer did not upload a file
        return res.status(400).json({
          message: "An error occured processing the avatar",
          error: error.message
        });
      }
    }
  },

  modifyAvatar: (req, res) => {

    const userId = req.user._id;
    const avatarOptions = {
      description: req.body.description ? req.body.description : "Eureka",
      user: req.user._id
    };
    let modifiedAvatar = {};
    // if changing the picture
    // delete old file and upload new one
    if (req.file) {      
      //first delete old avatar from file
      UserAvatar.findOne({user: userId})
      .then((avatar) => {
        return deleteFile(avatar.path, avatar);
      })
      .then((result) => {
        //set the new avatar path and save
        modifiedAvatar = result.data
        modifiedAvatar.path = req.file.path;
        modifiedAvatar.description = avatarOptions.description;
        return modifiedAvatar.save();
      })
      .then((avatar) => {
        return User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
      })
      .then((user) => {
        return res.json({
          message: "Modified avatar",
          user: {
            name: user.name,
            email: user.email,
            avatar: {
              path: user.avatar.path,
              description: user.avatar.description
            }
          }
        });
      })
      .catch((err) => {
        //protect from erroneus downloads - same is in {this.uploadAvatar}
        const avatarUpload = req.locals.avatarUpload;
        if(avatarUpload && avatarUpload.success) {
          return handleAvatarUploadError(avatarUpload.avatarPath, res, err);
        }
        else {
          return res.status(400).json({
            message: "An error occured",
            error: err.message,
          });
        }
      });
    }
    else {
    //else just modifying description
    //update avatar description or set a default string
     UserAvatar.findOne({user: userId})
      .then((userAvatar) => {
        if(!userAvatar) {
          throw new Error("Can't find avatar to modify");
        }
        userAvatar.description = avatarOptions.description;
        return userAvatar.save();
      })
      .then((userAvatar) => {
        return User.findOne({_id: userId}).populate("avatar", ["path", "description"]);
      })
      .then((user) => {
        res.json({
          message: "Modified avatar info",
          user: {
            name: user.name,
            email: user.email,
            avatar: {
              path: user.avatar.path,
              description: user.avatar.description
            }
          }
        });
      })
      .catch((error) => {
        return res.status(400).json({
          message: "An error occured",
          errors: error.message
        });
      });
    }
  },

  deleteAvatar: (req, res) => {
    const userId = req.user._id;
    //find the useravatar model and delete
    UserAvatar.findOneAndDelete({user: userId})
      .then((avatar) => {
        console.log(avatar);
        //delete old avatar file
        if (avatar) {
          return deleteFile(avatar.path, avatar);
        }
        else {
          return Promise.reject(new Error("No avatar seems to be present"));
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
          user: {
            name: user.name,
            email: user.email
          }
        });
      })
      
      .catch((err) => {
        console.log("error occured")
        return res.status(400).json({
          message: "An error occured",
          error: err.message
        });
      });
      
  }
};