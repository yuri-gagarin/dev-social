import authHelper from "../../../helpers/authHelper.js";

/**
 * Sets a typing timeout to track if user is typing.
 * @param {object} self the React component.
 * @param {number} timeoutLength Length of timeout.
 * @returns {void} sets state on React component.
 */
export const setTypingTimeout = (self, timeoutLength=3000) => {
  return setTimeout(() => {
    self.setState({
      typing: {
        value: false
      }
    })
  }, timeoutLength);
};

/**
 * Sets a typing timeout to track if user is typing in email.
 * @param {object} self the React component.
 * @param {number} timeoutLength Length of timeout.
 * @returns {void} Sets the email state after checking server.
 */
export const setEmailTimeout = (self, timeoutLength=3000) => {
  return setTimeout(() => {
    const {value, error} = self.state.email;
    if (value && !error) {
      authHelper(value)
        .then((response) => {
          if(!response.data.available) {
            self.setState({
              email: {
                value: value,
                error: {content: response.data.message, pointing: "below"}
              },
              emailAvailable: {
                value: false
              }
            });
          }
          else {
            self.setState({
              email: {
                value: value,
                error: null
              },
              emailAvailable: {
                value: true
              }
            });
          }
        })
        .catch((error) => {
          console.log(error.response);
          self.setState({
            email: {
              value: value,
              error: {content: `${error.response.statusText}: Unable to verify Email`}
            },
            emailAvailable: {
              value: false
            }
          });
        });
    }
    else {
      //email not valid - not sent to the server to check
      return;
    }
  }, timeoutLength)
};

/**
 * Checks if {state.typing} is true.
 * @param {object} self the React Component.
 * @returns {boolean} True or False typing state.
 */
export const checkTyping = (self) => {
  if (self.state.typing.value === true) {
    return true;
  }
  else {
    return false;
  }
};

/**
 * Matches two passwords.
 * @param {object} self the React Component.
 * @param {string} password1 First password to match.
 * @param {string} password2 Second password to match.
 * @returns {void} Sets state in components passwordConfirm value.
 */
export const matchPasswords = (self, password1, password2) => {
  if(password1 && password2) {
    if(password1 !== password2) {
      self.setState({
        passwordConfirm: {
          value: password2,
          error: {content: "Passwords don't match",  pointing: "below"},
        }
      });
    }
    else {
      self.setState({
        passwordConfirm: {
          value: password2,
          error: null,
        }
      });
    }
  }
};

/**
 * Checks the state of the form for errors and correct values.
 * @param {object} self the React Component.
 * @param {array} keys the array of keys to check in the Component state.
 * @return {boolean} False if form errors or incomplete, True if no errors.
 */
export const checkForFormCompletion = (self, keys) => {
  const currentState = self.state;

  if (currentState.typing.value) return false;
  if(currentState.emailAvailable) {
    if (!currentState.emailAvailable.value) return false;
  }

  for (let i = 0; i < keys.length; i++) {
    if (!currentState[keys[i]].value) { return false };
    if (currentState[keys[i]].error) { return false };
    if (currentState[keys[i]].value && currentState[keys[i]].error) { return false };
  }

  return true;
};

export const disableButton = (className) => {
  let btn = document.getElementsByClassName(className)[0];
  btn.classList.add("disabled");
};
export const enableButton = (className) => {
  let btn = document.getElementsByClassName(className)[0];
  btn.classList.remove("disabled");
};
