import isEmpty from "./isEmpty.js";
import validator from "validator";

export default function (data) {

  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (!validator.isLength(data.title, { min: 1, max: 50 })) {
    errors.title = "Title should be between 1 and 50 characters"
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }
  if (validator.isEmpty(data.location)) {
    errors.location = "Location field is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "Start date field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};