import UserAvatar from "../models/UserAvatar.js";
import User from "../models/User.js";
import deleteFile from "../helpers/deleteFile.js";

//working upload/update/delete avatar routes
//perhaps refactor later with less nested promises

export default {
  uploadAvatar: (req, res) => {
    if (req.file) {

      const avatarOptions = {};
      //check for optional description
      if (req.body.description) avatarOptions.description = req.body.description;
      if (req.file.path) avatarOptions.path = req.file.path;
      if (req.user._id) avatarOptions.user = req.user._id;

      const userId = req.user._id;

      //get the user first
      User.findOne({_id: userId})
        .populate("avatar", ["path", "description"])
        .then((user) => {
          //check if user already has an avatar
          if(user.avatar && user.avatar !== null) {
            //if has avatar,  first delete old avatar from server
            deleteFile(user.avatar.path)
              .then(() =>  {
                //then update the user avatar with new path and description
                UserAvatar.findOneAndUpdate({user: user}, {path: avatarOptions.path, description: avatarOptions.description}, {new: true})
                  .then((updatedAvatar) => {
                    //return the updated user file
                    User.findOne({_id: user})
                      .populate("avatar", ["path", "description"])
                      .then((user) => {
                        return res.json({
                          message: "Avatar successfully updated",
                          user: user
                        });
                      })
                  })
              })  
              .catch((err) => { return res.status(400).json({message: "Error", errors: err})});
          }
          else {
            //if no avatar present for user, create the new entry in database
            UserAvatar.create(avatarOptions)
              .then((avatar) => {
                User.findOneAndUpdate({_id: userId}, {avatar: avatar._id}, {new: true})
                  .populate("avatar", ["path", "description"])
                  .then((user) => {
                    return res.json({
                      message: "Avatar successfully uploaded",
                      user: user
                    })
                  })
                  .catch((err) => { return res.status(400).json({message: "Error updating user", errors: err})});
              })
              .catch((err) => { return res.status(400).json({message: "Error creating avatar", errors: err})});
          }
        })
        //general error catch if for some reason can retrieve a user
        .catch((err) => {
          return res.status(400).json({
            message: "Error getting a user",
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
  deleteAvatar: (req, res) => {
    const userId = req.user._id;
    //const user = req.user;

    //find the user avatar model
    UserAvatar.findOneAndRemove({user: userId})
      .then((avatar) => {
        //check for avatar present
        if (avatar) {
          deleteFile(avatar.path)
            .then((response) => {
              //update user model
              User.findOneAndUpdate({_id: userId}, {avatar: null}, {new: true})
                .then((user) => {
                  //return updated user model
                  return res.json({
                    message: "Successfully deleted avatar",
                    response: response,
                    user: user
                  });
                })
                .catch((err) => {
                  return res.status(400).json({
                    message: "User error",
                    errors: err
                  });
                })
            })
            .catch((err) => {
              return res.status(400).json({
                message: "Delete error",
                errors: err
              });
            });
        }
        else {
          return res.status(400).json({
            message: "no avatar found",
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error deleting avatar",
          errors: err
        });
      });
  }
};