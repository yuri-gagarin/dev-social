import profilesController from "../controllers/profilesController";
import passport from "passport";

export default function(router) {

  // @route GET /profile/handle/:handle
  // @desc Show user profile by handle
  // @access Public
  router
    .route("/profile/handle/:handle")
    .get(profilesController.getProfileByHandle);

  // @route GET /profile/:user_id
  // @desc Show user profile by user id
  // @access Public
  router
    .route("/profile/user/:user_id")
    .get(profilesController.getProfileByID);

  // @route GET /profile/all
  // @desc Gets all of user profile
  // @access Public
  router
    .route("/profile/all")
    .get(profilesController.allProfiles);

  // @route  GET /profile
  // @desc Gets user profile
  // @access Private
  router
    .route("/profile")
    .get(passport.authenticate("jwt", {session: false}),profilesController.profile);

  // @route POST /save_profile
  // @desc Saves user profile
  // @access Private
  router
    .route("/save_profile")
    .post(passport.authenticate("jwt", {session: false}),
    profilesController.saveProfile);

  // @route DELETE /delete_profile
  // @desc Deletes user profile
  // @access Private
  router
    .route("/delete_profile")
    .delete(passport.authenticate("jwt", {session: false}),
    profilesController.deleteProfile);
};