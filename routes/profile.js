import profilesController from "../controllers/profilesController";
import passport from "passport";

export default function(router) {

  // @route  GET /profile
  // @desc gets user profile
  // @access Private
  router
    .route("/profile")
    .get(passport.authenticate("jwt", {session: false}),profilesController.profile);

  // @route POST /create_profile
  // @desc gets user profile
  // @access Private
  router
    .route("/create_profile")
    .post(passport.authenticate("jwt", {session: false}),
    profilesController.createProfile);

};