import isEmpty from "./isEmpty.js";
import emailValidator from "./emailValidator.js";
/**
 * @desription Validates new user data.
 * @param {object} userData new user object
 * @return {object} An object with errors and isValid property
 */
export default function(userData) {
  const errors = {};
  //validate user name and last name
  if (userData.name) {
    if (userData.name.length < 2) {
      errors.name = "Name should be at least 2 characters";
    }
  }
  else {
    errors.name = "Name field is required";
  }
  if (userData.lastName) {
    if (userData.lastName.length < 2) {
      errors.lastName = "Last name should be at least 2 characters";
    }
  }
  else {
    errors.lastName = "Last name field is required";
  }
  //validate user email
  if (userData.email) {
    if(!emailValidator(userData.email)) {
      errors.email = "Email is invalid";
    }
  }
  else {
    errors.email = "Email field is required";
  }
  //validate user password - make sure they match
  if (userData.password) {
    if (!userData.passwordConfirm) {
      errors.password = "You must confirm your password";
    }
    if(userData.password !== userData.passwordConfirm) {
      errors.password = "Passwords do not match";
    }
  }
  else {
    errors.password = "Password field is required";
  }
  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};