import validator from "validator";
import isEmpty from "./isEmpty.js";
 
export default function(data) {
  let errors = {};

  if(!validator.isLength(data.name), { min: 2, max: 30 }) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
