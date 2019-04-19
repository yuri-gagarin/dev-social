import UserAvatar from "../models/UserAvatar.js";
import User from "../models/User.js";
import deleteFile from "../helpers/deleteFile.js";

export default {
  uploadAvatar: (req, res) => {
    if (req.file) {

      const avatarOptions = {};
      //check for optional description
      if (req.body.description) avatarOptions.description = req.body.description;
      if (req.file.path) avatarOptions.path = req.file.path;
      if (req.user._id) avatarOptions.user = req.user._id;
      const user = req.user;
      const userId = req.user._id;
      User.findOne({_id: userId})
        .populate("avatar", ["path", "description"])
        .then((user) => {
          if(user.avatar && user.avatar !== null) {
            console.log("updating avatar");
            console.log("Deleting at: ", user.avatar.path);
            deleteFile(user.avatar.path)
              .then(() =>  {
                console.log("Updating new avatar")
                UserAvatar.findOneAndUpdate({user: user}, {path: avatarOptions.path, description: avatarOptions.description}, {new: true})
                  .then((updatedAvatar) => {
                    console.log("Updated avatar options:");
                    console.log(updatedAvatar);
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
            console.log("creating avatar");

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
        .catch((err) => {
          return res.status(400).json({
            message: "Error getting a user",
            errors: err
          });
        }); 
    }
  },
  deleteAvatar: (req, res) => {
    const userId = req.user._id;
    const user = req.user;

    UserAvatar.findOneAndRemove({user: userId})
      .then((avatar) => {
        console.log("Deleting Avatar")
        if (avatar) {
          console.log(avatar);
          deleteFile(avatar.path)
            .then((response) => {

              User.findOneAndUpdate({_id: userId}, {avatar: null}, {new: true})
                .then((user) => {
                  console.log("After update");
                  console.log(user);
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