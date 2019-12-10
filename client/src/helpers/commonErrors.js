export const loginError = new Error("Must be logged in");

export const generalError = (message) => {
  if(message & typeof message === "string") {
    return new Error(message);
  }
  else {
    return new Error("Something went wrong ...");
  }
};

