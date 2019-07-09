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

  // @route POST /users/modify
  // @desc Modifies User Access Control
  // @access Private
  router
    .route("/users/edit/:id")
    .patch([passport.authenticate("jwt", { session: false }), accessController("user", "edit_user")], usersController.modifyUser);

  // @route GET /users/current_user
  // @desc Return current user
  // @access Private
  router
    .route("/users/current_user")
    .get(passport.authenticate("jwt", { session: false }), usersController.currentUser);
};

