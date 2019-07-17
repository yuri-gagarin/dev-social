import passport from "passport";
import avatarUploader from "../uploaders/avatarUploader.js";
import uploadsController from "../controllers/uploadsController.js";




export default function(router) {

  // @route POST /uploads/upload_avatar
  // @desc Uploads user avatar
  // @access Private
  router
    .route("/uploads/upload_avatar")
    .post([passport.authenticate("jwt", {session: false}), avatarUploader], uploadsController.uploadAvatar);

  // @route PATCH /uploads/modify_avatar
  // @desc Modifies existing avatar
  // @access Private
  router 
    .route("/uploads/modify_avatar")
    .patch([passport.authenticate("jwt", {session: false}), avatarUploader], uploadsController.modifyAvatar);

  // @route DELETE /uploads/delete_avatar
  // @desc Deletes user avatar
  // @access Private
  router  
    .route("/uploads/delete_avatar")
    .delete(passport.authenticate("jwt", {session: false}), uploadsController.deleteAvatar);
};

