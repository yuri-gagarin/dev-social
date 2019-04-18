import passport from "passport";
import avatarUploader from "../uploaders/avatarUploader.js";
import uploadsController from "../controllers/uploadsController.js";

export default function(router) {

  // @route POST /uploads/upload_avatar
  // @desc Uploads user avatar
  // @access Private
  router
    .route("/uploads/upload_avatar")
    .post(avatarUploader.single("avatar"), uploadsController.uploadAvatar);
}