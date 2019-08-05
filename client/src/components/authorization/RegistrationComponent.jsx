import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import style from "../../assets/stylesheets/authorization/registration.scss";
import emailValidator from "../../helpers/emailValidator.js";
import nameValidator from "../../helpers/nameValidator.js";
import passwordValidator from "../../helpers/passwordValidator.js";
import authHelper from "../../helpers/authHelper.js";


const setTypingTimeout = (self) => {
  return setTimeout(() => {
    self.setState({
      typing: {
        value: false
      }
    })
  }, 4000);
};

const setEmailTimout = (self) => {
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
  }, 3000)
};

const matchPasswords = (self, password1, password2) => {
  if(password1 && password2) {
    console.log("matching")
    console.log(`${password1} --- ${password2}`)
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

const checkTyping = (self) => {
  if (self.state.typing.value === true) {
    return true;
  }
  else {
    return false;
  }
};

const checkForFormCompletion = (self, keys) => {
  const currentState = self.state;

  if (currentState.typing.value) return false;
  if (!currentState.emailAvailable.value) return false;

  for (let i = 0; i < keys.length; i++) {
    if (!currentState[keys[i]].value) {console.log(`${keys[i]}: needs a value`); return false};
    if (currentState[keys[i]].error) {console.log(`${keys[i]} has error: ${keys[i].error}` ); return false};
    if (currentState[keys[i]].value && currentState[keys[i]].error) {console.log(`Error: ${keys[i].error}`); return false};
  }
  return true;
};


const disableButton = (className, state) => {
  let btn = document.getElementsByClassName(className)[0];
  btn.classList.add("disabled");
};
const enableButton = (className, state) => {
  let btn = document.getElementsByClassName(className)[0];
  btn.classList.remove("disabled");
};


class RegistrationComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: {
        value: null,
        emailTimeout: null,
      },
      emailAvailable: {
        value: false,
      },
      firstName: {
        value: null,
      },
      lastName: {
        value: null,
      },
      password: {
        value: null,
      },
      passwordConfirm: {
        value: null,
      },
      valid: {
        value: false,
      },
      typingTimeout: {
        value: null,
      },
      typing: {
        value: false,
      },
      completed: {
        value: false,
      }
    };

    this.toValidate = ["email", "firstName", "lastName", "password", "passwordConfirm"];
  }
  //lifecycle methods
  componentDidMount() {
    disableButton("registerButton", this.state);
  }

  componentDidUpdate() {
    if(!checkTyping(this)) {
      if(checkForFormCompletion(this, this.toValidate)) {
        enableButton("registerButton");
      }
      else {
        disableButton("registerButton");
      }
    };
  }

  componentWillUnMount() {
    if(this.state.email.emailTimeout) {
      clearTimeout(this.state.email.emailTimeout);
    }
    if(this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
  }

  //form methods
  handleEmail(event) {

    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }
    if(this.state.email.emailTimeout) {
      clearTimeout(this.state.email.emailTimeout);
    }

    if(!emailValidator(this.state.email.value)) {
      this.setState({
        email: {
          value: event.target.value,
          emailTimeout: setEmailTimout(this),
          error: {content: "Invalid Email", pointing: "below"},
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
    else {
      this.setState({
        email: {
          value: event.target.value,
          emailTimeout: setEmailTimout(this),
          error: null,
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      })
    }
  }

  handleFirstName(event) {
    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }
    //validate name and length of at least one char
    const {error, valid} = nameValidator(event.target.value);
    if(!valid) {
      this.setState({
        firstName: {
          value: event.target.value,
          error: {content: error, pointing: "below"},
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
    else {
      this.setState({
        firstName: {
          value: event.target.value,
          error: null,
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
  }

  handleLastName(event) {
    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }
    //validate last name as well
    const {error, valid} = nameValidator(event.target.value);
    if(!valid) {
      this.setState({
        lastName: {
          value: event.target.value,
          error: {content: error, pointing: "below"},
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
    else {
      this.setState({
        lastName: {
          value: event.target.value,
          error: null
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
  }

  handlePassword(event) {
    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }
    if(this.state.passwordConfirm.value) {
      matchPasswords(this, event.target.value, this.state.passwordConfirm.value);
    };

    const passwordReqs = `Password must be: At least 8 letters. One uppercase letter. One lowercase letter. And one number.`;
    //validate password length and chars
    const error = passwordValidator(event.target.value) ? null : {content: passwordReqs, pointing: "below"};
    this.setState({
      password: {
        value: event.target.value,
        error: error,
      },
      typingTimeout: {
        value: setTypingTimeout(this),
      },
      typing: {
        value: true,
      }
    });
  }

  handlePasswordConfirm(event) {
    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }
    if(this.state.password.value) {
      matchPasswords(this, this.state.password.value, event.target.value);
    };
    
    if (this.state.password.value !== event.target.value) {
      this.setState({
        passwordConfirm: {
          value: event.target.value,
          error: {content: "Passwords do not match", pointing: "below"},
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
    else {
      this.setState({
        passwordConfirm: {
          value: event.target.value,
          error: null,
        },
        typingTimeout: {
          value: setTypingTimeout(this),
        },
        typing: {
          value: true,
        }
      });
    }
  
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }


  render() {
    return (
      <Container>
        <h3 className={style.registerTitle}>Register</h3>
        <Form>
          <Form.Input
            error={this.state.email.error}
            fluid
            label="Email"
            placeholder="Email"
            onChange={ (e) => {this.handleEmail(e)} }
          />
          <Form.Input
            error={this.state.firstName.error}
            fluid
            label="First Name"
            placeholder="Email"
            onChange={ (e) => {this.handleFirstName(e)} }
          />
          <Form.Input
            error={this.state.lastName.error}
            fluid
            label="Last Name"
            placeholder="Last Name"
            onChange={ (e) => {this.handleLastName(e)}}
          />
          <Form.Input
            error={this.state.password.error}
            fluid
            label="Password"
            //type="password"
            placeholder="Password"
            onChange={ (e) => {this.handlePassword(e)} }
          />
          <Form.Input
            error={this.state.passwordConfirm.error}
            fluid
            label="Confirm Password"
            //type="password"
            placeholder="Confirm Password"
            onChange={ (e) => {this.handlePasswordConfirm(e)} }
          />
          <Button className="registerButton" type="submit" onClick={ (e) => this.handleSubmit(e) }>Submit</Button>
        </Form>
      </Container>
    )
  }
}


export default RegistrationComponent;