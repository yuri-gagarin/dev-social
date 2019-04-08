import validator from "validator";
import isEmpty from "./isEmpty";

export default function (data) {

  let errors = {};

  data.handle = (!isEmpty(data.handle) ? data.handle : "" );
  data.status = (!isEmpty(data.status) ? data.status : "");
  data.bio = (!isEmpty(data.bio) ? data.bio : "");
  data.skills = (!isEmpty(data.skills) ? data.skills : "");

  if (!validator.isLength(data.handle, { min: 2, max: 25} )) {
    errors.handle = "Handle needs to be between 2 and 25 letters";
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = "Handle cant be blank";
  }
  if (validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }
  if (validator.isEmpty(data.bio)) {
    errors.bio = "Bio field is required";
  }
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid youtube ULR";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid facebook URL";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid instagram URL";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid twitter URL";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid linkedin URL";
    }
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };

};