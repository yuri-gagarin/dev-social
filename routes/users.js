import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import passport from "passport";

export default function(router) {
  // @route GET /users
  // @desc Users test
  // @access Public
  router
    .route("/users")
    .get((req, res) => {
      res.json({
        message: "Users Works"
      });
    });

  // @route POST /register
  // @desc User registration
  // @access Public 
  router 
    .route("/register")
    .post((req, res) => {
      const email = req.body.email;

      if (email) { 
        User.findOne({email: email})
          .then((user) => {
            if(user) {
              return res.status(400).json({message: "email already exists"});
            }
            else {
              const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
              });

              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if(err) {
                    console.log(err)
                  }
                  else {
                    newUser.password = hash;
                    newUser.save() 
                      .then((user) => res.json(user))
                      .catch((err) => console.log(err));
                  }
                });
              });
            }
          });
      }
    });
  
  // @route POST /login
  // @desc Login User / Return JWT Token
  // @access Public
  router 
    .route("/login")
    .post((req, res) => {
      const email = req.body.email;
      const password = req.body.password
      if (email && password) {
        User.findOne({email: email})
        .then((user) => {
          //found user
          if(user) {
            //check password
            bcrypt.compare(password, user.password)
            .then((correctPassword) => {
              if (correctPassword) {
                //user email and password matched
                //login
                const tokenPayload = {
                  id: user.id,
                  name: user.name,
                  email: user.email
                };

                jwt.sign(tokenPayload, keys.secretOrKey, {expiresIn: 1800}, (err, token) => {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    return res.json({
                      success: true,
                      token: `Bearer ${token}`,
                      message: "logged in",
                      name: user.name,
                      email: user.email
                    });
                  }
                });       
              }
              else {
                return res.status(400).json({
                  message: "failed login",
                  errorMsg: "password incorrect"
                });
              }
            });
          }
          else {
            return res.status(404).json({message: "user not found"});
          }
          //end if found user
        })
      }
      else {
        return res.status(400).json({message: "bad request"});
      }
      //end if (email && password)
    });

    // @route GET /current_user
    // @desc Return current user
    // @access Private
    router
      .route("/current_user")
      .get(passport.authenticate("jwt", { session: false }), (req, res) => {
        return res.json({
          message: "Success",
          user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
          }
        });
      });
};

