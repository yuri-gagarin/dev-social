import usersController from "../controllers/usersController.js";
import passport from "passport";
import accessController from "../controllers/access_control/accessController.js";

export default function(router) {

  // @route GET /users/index
  // @desc Users test
  // @access Public
  router
    .route("/users/index")
    .get(usersController.test);

  // @route POST /users/register
  // @desc User registration
  // @access Public 
  router 
    .route("/users/register")
    .post(usersController.register);
  
  // @route POST /users/login
  // @desc Login User / Return JWT Token
  // @access Public
  router 
    .route("/users/login")
    .post(usersController.login);

  // @route PATCH /users/edit/
  // @desc Edits a user
  // @access Private
  router
    .route("/users/edit/:id")
    .patch([passport.authenticate("jwt", { session: false }), accessController("user", "edit_user")], usersController.editUser);
  
  // @route PATCH /users/set_access_level
  // @desc sets a user access level
  // @access Private
  router
    .route("/users/set_access_level")
    .patch([passport.authenticate("jwt", {session: false}), accessController("user", "set_access_level")], usersController.setUserAccessLevel);

  // @route PATCH /users/set_moderator
  // @desc sets new moderator privileges
  // @access Private
  router
    .route("/users/set_moderator")
    .patch([passport.authenticate("jwt", {session: false}), accessController("user", "set_moderator")], usersController.setModerator);
  
  // @route PATCH /users/remove_moderator
  // @desc removes moderator privileges
  // @access Private
  router 
    .route("/users/remove_moderator")
    .patch([passport.authenticate("jwt", {session: false}), accessController("user", "remove_moderator")], usersController.removeModerator);

  // @route GET /users/current_user
  // @desc Return current user
  // @access Private
  router
    .route("/users/current_user")
    .get(passport.authenticate("jwt", { session: false }), usersController.currentUser);
};

