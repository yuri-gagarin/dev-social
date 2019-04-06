import profilesController from "../controllers/profilesController";
import passport from "passport";

export default function(router) {

  router

    // @route  GET /profile
    // @desc gets user profile
    // @access Private
    .route("/profile")
    .get(passport.authenticate("jwt", {session: false}),profilesController.profile);
};