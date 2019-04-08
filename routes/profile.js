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

  // @route POST /profile/save_profile
  // @desc Saves user profile
  // @access Private
  router
    .route("/profile/save_profile")
    .post(passport.authenticate("jwt", {session: false}),
    profilesController.saveProfile);

  // @route POST /profile/save_experience
  // @desc Saves user profile experience
  // @access Private
  router
    .route("/profile/save_experience")
    .post(passport.authenticate("jwt", {session: false}), profilesController.saveExperienceToProfile);

  // @route POST /profile/save_education
  // @desc Saves user profile education
  // @access Private
  router
    .route("/profile/save_education")
    .post(passport.authenticate("jwt", {session: false}),
    profilesController.saveEducationToProfile)
  
  // @route DELETE /profile/delete_profile
  // @desc Deletes user profile
  // @access Private
  router
    .route("/profile/delete_profile")
    .delete(passport.authenticate("jwt", {session: false}),
    profilesController.deleteProfile);
};