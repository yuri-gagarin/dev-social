export const createError = (errors) => {
  let errorMessages = [];
  for (let key in errors) {
    errorMessages.push(`${key}: ${errors[key]} \n`);
  }
  return new Error(`${errorMessages.join("")}`);
};