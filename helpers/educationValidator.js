import isEmpty from "./isEmpty.js";
import validator from "validator";

export default function(data) {

  const errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};