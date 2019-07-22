import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import User from "../models/User.js";
import rejectionPromise from "../helpers/APIhelpers/rejectionPromise.js";
import Roles from "../models/access_control/Roles.js";
import emailValidator from "../helpers/validators/emailValidator.js";
import newUserValidator from "../helpers/validators/newUserValidator.js"
import hashPassword from "./controller_helpers/hashPassword.js";
import getIp from "./controller_helpers/getIp.js";
import getUserInfo from "./controller_helpers/getUserInfo.js";



export default {
  test: (req, res) => {
    res.json({
      user: "user details here"
    });
  },
  login: (req, res) => {
    const email = req.body.email;
    const password = req.body.password
    let user;
    //validate for valid email
    if (!emailValidator(email)) {
      return res.status(400).json({
        message: "Invalid email"
      });
    }

    if (email && password) {
      User.findOne({email: email})
      .then((foundUser) => {
        //found user
        if(foundUser) {
          user = foundUser
          //check password
          return bcrypt.compare(password, foundUser.password);
        }
        else {
          let noUserError = new Error("No user was found with that email");
          return Promise.reject(noUserError);
        }
      })
      .then((correctPassword) => {
        if (correctPassword) {
          //user email and password matched
          //login
          const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email
          };
          //sign the token
          jwt.sign(tokenPayload, keys.secretOrKey, {expiresIn: 7200}, (err, token) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                message: "An error occured"
              });
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
      })
      .catch((error) => {
        console.log(error)
        return res.status(400).json({
          message: "An error occured",
          errorMsg: error.message
        });
      });
    }
    else {
      return res.status(400).json({
        message: "Input error",
        error: "Email and password are required fields"
      })
    }
  },

  register: (req, res) => {
    const email = req.body.email;
    const {errors, isValid} = newUserValidator(req.body);
    let newUser;

    if (isValid) { 
      User.findOne({email: email})
        .then((user) => {
          if(user) {
            return res.status(400).json({message: "email already exists"});
          }
          else {
            newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              role: "user"
            });
            return hashPassword(10, newUser.password);
          }
        })
        .then((hash) => {
          newUser.password = hash;
          return newUser.save();
        })
        .then((user) => {
          return res.json({
            message: "New user created",
            user: {
              name: user.name,
              email: user.email
            }
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(400).json({
            message: "An error occured"
          });
        });
    }
    else {
      return res.status(400).json({
        message: "Invalid user input",
        errors: errors
      })
    }
  },

  editUser: (req, res) => {
    const {oldPassword, newPassword, newPasswordConfirm, email, name} = req.body;
    const userId = req.params.id;
    const user = req.user;
    const errors = {};
    const modifiedUser = {};
    let isValid = true;

    //validate input
    //validate email
    if(email) {
      if(!emailValidator(email)) {
        errors.email = "Seems to be an invalid email";
        isValid = false;
      }
      else {
        modifiedUser.email = email;
      }
    }
    //validate new password and confirm
    if(newPassword) {
      if(newPassword !== newPasswordConfirm || !newPasswordConfirm) {
        errors.passwordConfirm = "New passwords do not match";
        isValid = false;
      }
      else {
        modifiedUser.password = newPassword;
        //modifiedUser.matchedPasswords = true;
      }
    }
    //validate name
    if(name) {
      if (name.length > 1) {
        modifiedUser.name = name;
      }
      else {
        errors.name = "Name should be at least two characters"
        isValid = false;
      }
    }
    //check if validations passed
    if (!isValid) {
      return res.status(400).json({
        message: "Input error",
        errors: errors
      });
    }
    //superadmin or admin can edit users without user password
    if(user.role === "super_admin" || user.role === "administrator") {
      const options = {new: true, maxTimeMS: 3000, runValidators: true};
      //if admin is setting a new password for a user
      //first hash the password
      if (modifiedUser.password) {
        hashPassword(10, modifiedUser.password)
          .then((hashedPassword) => {
            modifiedUser.password = hashedPassword;
            return User.findOneAndUpdate({_id: userId}, modifiedUser, options);
          })
          .then((user) => {
            return res.json({
              message: "User successfuly updated",
              user: {
                name: user.name,
                email: user.email
              }
            })
          })
          .catch((error) => {
            console.log(error);
            return res.status(400).json({
              message: "An error occured"
            });
          })
      }
      //else admin is editing everything else but the password
      else {
        User.findOneAndUpdate({_id: userId}, modifiedUser, options)
          .then((user) => {
            return res.json({
              message: "User successfully updated",
              user: {
                name: user.name,
                email: user.email
              }
            });
          })
          .catch((error) => {
            console.log(error);
            return res.status(400).json({
              message: "An error occured"
            });
          });
      }
      //end admin - super-admin user edit
    }
    else {
      //if the user.role is user or moderator
      //regular users and moderators must enter their old password to edit
      if(!oldPassword) {
        errors.password = "You must enter your current password to make changes";
        isValid = false;
      }
      if(!isValid) {
        return res.status(400).json({
          message: "Input error",
          errors: errors
        })
      }
      const options = {new: true, maxTimeMS: 3000, runValidators: true};
      User.findOne({_id: userId})
        .then((user) => {
          if(user) {
            //check for correct password for modifications
            return bcrypt.compare(oldPassword, user.password);
          }
          else {
            return Promise.reject(new Error("Cannot find a user"));
          }
        })
        .then((matched) => {
          //if passwords match - user can do modifications
          if (matched) {
            if (modifiedUser.password) {
              hashPassword(10, modifiedUser.password)
                .then((hash) => {
                  modifiedUser.password = hash;
                  return User.findOneAndUpdate({_id: userId}, modifiedUser, options)
                })
                .then((updatedUser) => {
                  return res.json({
                    message: "User updated",
                    user: {
                      name: updatedUser.name,
                      email: updatedUser.email
                    }
                  });
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(400).json({
                    message: "An error occured"
                  });
                });
            }
            else {
              User.findOneAndUpdate({_id: userId}, modifiedUser, options)
                .then((updatedUser) => {
                  return res.json({
                    message: "User updated",
                    user: {
                      name: updatedUser.name,
                      email: updatedUser.email
                    }
                  });
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(400).json({
                    message: "An error occured"
                  });
                });
            }
          }
          //if user password is wrong
          else {
            return res.status(400).json({
              message: "Wrong password entered"
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            message: "An error occured"
          });
        });
    }
  },

  setUserAccessLevel: (req, res) => {
    const {userToChange, accessLevel} = req.body;
    const userRoles = Object.keys(Roles);
    //check for a valid role passed in
    //if the role exists in the Roles.js object then update user role
    if (!userRoles.includes(accessLevel)) {
      return res.status(400).json({
        message: "Invalid user role"
      });
    }

    User.findOne({_id: userToChange})
      .then((user) => {
        if (user) {
          user.role = accessLevel;
          return user.save();
        }
        else {
          return rejectionPromise(new Error("No user found"));
        }
      })
      .then((user) => {
        return res.json({
          message: "User role modified",
          user: {
            name: user.name,
            email: user.email,
            role: user.role
          } 
        })
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({
          message: "An error occcured"
        })
      });
    
  },

  setModerator: (req, res) => {
    let newModerator = req.body.newModId;
    //check for a moderator id passed in
    if(!newModerator) {
      return res.status(400).json({
        message: "New moderator id seems to be empty"
      });
    }

    User.findOneAndUpdate({_id: newModerator}, 
      {$set: {role: "moderator"} },
      {new: true, maxTimeMS: 3000})
      .populate("avatar", ["path"])
      .then((user) => {
        if(user) {
          if (user.role === "moderator") {
            return res.status(400).json({
              message: `User ${user.name} is already a moderator`
            });
          }
          return res.json({
            message: "Successfully added moderator privileges",
            user: {
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        }
        else {
          return res.status(400).json({
            message: "Seems no user was found"
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(400).json({
          message: "An error occured"
        });
      });
  },

  removeModerator: (req, res) => {
    let modToRemove = req.body.moderatorId;

    if(!modToRemove) {
      return res.status(400).json({
        message: "The moderator id seemes to be empty"
      });
    }

    User.findOneAndUpdate({_id: modToRemove},
      {$set: {role: "user"} },
      {new: true, maxTimeMS: 3000})
      .populate("avatar", ["path"])
      .then((user) => {
        if (user) {
          if(user.role !== "moderator") {
            return res.status(400).json({
              message: `User: ${user.name} is not a moderator`
            });
          }
          return res.json({
            message: "Successfully removed moderator privileges",
            user: {
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        }
        else {
          return res.status(400).json({
            message: "Seems no user was found"
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({
          message: "An error occured"
        });
      });
  },

  currentUser: (req, res) => {
    User.findOne({_id: req.user.id})
      .populate("avatar", ["path", "description"])
      .then((user) => {
        return res.json({
          message: "Success",
          user: user
        });
      })
      .catch((err) => {
        return res.status(404).json({
          message: "Nothing seems to be here",
          errors: err
        });
      });
    
  },
  
};