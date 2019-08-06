import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import style from "../../assets/stylesheets/authorization/registration.scss";
import emailValidator from "../../helpers/emailValidator.js";
import nameValidator from "../../helpers/nameValidator.js";
import passwordValidator from "../../helpers/passwordValidator.js";
import axios from "axios";
import {setTypingTimeout, setEmailTimeout, checkTyping,
        matchPasswords, checkForFormCompletion, 
        disableButton, enableButton } from "./helper_methods/formHelper.js";

const registerUser = (userInfo) => {
  const options = {
    method: "POST",
    url: "/api/users/register",
    data: {
      ...userInfo
    }
  };
  return axios(options);
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
    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
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
          emailTimeout: setEmailTimeout(this, 2000),
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
          emailTimeout: setEmailTimeout(this, 2000),
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
    const newUserInfo = {
      name: this.state.firstName.value,
      lastName: this.state.lastName.value,
      email: this.state.email.value,
      password: this.state.password.value,
      passwordConfirm: this.state.passwordConfirm.value,
    };
    
    registerUser(newUserInfo)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      })
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
            type="password"
            placeholder="Password"
            onChange={ (e) => {this.handlePassword(e)} }
          />
          <Form.Input
            error={this.state.passwordConfirm.error}
            fluid
            label="Confirm Password"
            type="password"
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