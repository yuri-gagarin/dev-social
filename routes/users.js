import UsersController from "../controllers/usersController.js";
import passport from "passport";
import accessController from "../controllers/access_control/accessController.js";

export default function(router) {

  // @route POST /api/user/register_test
  // @desc User registration front end test
  // @access Public
  router
    .route("/api/users/register_test")
    .post(UsersController.registerTest);
  
  // @route POST /api/users/check_email
  // @desc Check for a present User email
  // @access Public
  router
    .route("/api/users/check_email")
    .post(UsersController.checkEmail);
  
  // @route POST /api/users/register
  // @desc User registration
  // @access Public 
  router 
    .route("/api/users/register")
    .post(UsersController.register);

  // @route POST /users/login
  // @desc Login User / Return JWT Token
  // @access Public
  router 
    .route("/users/login")
    .post(UsersController.login);

  // @route PATCH /users/edit/
  // @desc Edits a user
  // @access Private
  router
    .route("/users/edit/:id")
    .patch([passport.authenticate("jwt", { session: false }), accessController("user", "edit_user")], UsersController.editUser);
  
  // @route PATCH /users/set_access_level
  // @desc sets a user access level
  // @access Private
  router
    .route("/users/set_access_level")
    .patch([passport.authenticate("jwt", {session: false}), accessController("user", "set_access_level")], UsersController.setUserAccessLevel);

  // @route PATCH /users/set_moderator
  // @desc sets new moderator privileges
  // @access Private
  router
    .route("/users/set_moderator")
    .patch([passport.authenticate("jwt", {session: false}), accessController("user", "set_moderator")], UsersController.setModerator);
  
  // @route PATCH /users/remove_moderator
  // @desc removes moderator privileges
  // @access Private
  router 
    .route("/users/remove_moderator")
    .patch([passport.authenticate("jwt", {session: false}), accessController("user", "remove_moderator")], UsersController.removeModerator);

  // @route GET /users/current_user
  // @desc Return current user
  // @access Private
  router
    .route("/users/current_user")
    .get(passport.authenticate("jwt", { session: false }), UsersController.currentUser);
};

