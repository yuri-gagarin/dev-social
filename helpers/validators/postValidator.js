import validator from "validator";
import isEmpty from "./isEmpty";


export default function(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (validator.isEmpty(data.text)) {
    errors.text = "Please write something here... anything?"
  }

  if (data.text.length < 2) {
    errors.text = "Come on you can do better than two letters"
  }
  
  if (data.text.length > 300) {
    errors.text = "Woa there Shakespeare... keep it under 300 characters..."
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};