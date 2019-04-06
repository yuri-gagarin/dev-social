import usersController from "../controllers/usersController.js";
import passport from "passport";

export default function(router) {
  
  // @route GET /users
  // @desc Users test
  // @access Public
  router
    .route("/users")
    .get(usersController.test);

  // @route POST /register
  // @desc User registration
  // @access Public 
  router 
    .route("/register")
    .post(usersController.register);
  
  // @route POST /login
  // @desc Login User / Return JWT Token
  // @access Public
  router 
    .route("/login")
    .post(usersController.login);

  // @route GET /current_user
  // @desc Return current user
  // @access Private
  router
    .route("/current_user")
    .get(passport.authenticate("jwt", { session: false }), usersController.currentUser);
};

