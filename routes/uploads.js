import passport from "passport";
import avatarUploader from "../uploaders/avatarUploader.js";
import uploadsController from "../controllers/uploadsController.js";

export default function(router) {

  // @route POST /uploads/upload_avatar
  // @desc Uploads user avatar
  // @access Private
  router
    .route("/uploads/upload_avatar")
    .post(passport.authenticate("jwt", {session: false}), avatarUploader.single("avatar"), uploadsController.uploadAvatar);

  // @route POST /uploads/delete_avatar
  // @desc Deletes user avatar
  // @access Private
  router  
    .route("/uploads/delete_avatar")
    .post(passport.authenticate("jwt", {session: false}), uploadsController.deleteAvatar);
};

