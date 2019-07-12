import isEmpty from "./isEmpty.js";
import validator from "validator";

export default function(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (validator.isEmpty(data.text)) {
    errors.text = "Your comment seems to be empty";
  }
  if (data.text.length > 300) {
    errors.text = "Lets keep this under 300 characters";
  }
  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};