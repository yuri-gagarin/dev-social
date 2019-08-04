import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import style from "../../assets/stylesheets/authorization/registration.scss";
import emailValidator from "../../helpers/emailValidator.js";
import nameValidator from "../../helpers/nameValidator.js";
import passwordValidator from "../../helpers/passwordValidator.js";
import authHelper from "../../helpers/authHelper.js";

const checkForFormCompletion = (state) => {
  console.log(state.emailVerified.value)
  if (!state.emailVerified.value) return false;
  for(let key in state) {
    console.log("no value");
    if(!state[key].value) {
      return false;
    }
    if(state[key].value && state[key].error){
      return false;
    }
  }
  console.log("HERE")
  this.setState({completed: true}, ()=> {
    return true;
  }, () => {
    console.log(this.state);
  });
};
const disableButton = (className, state) => {
  let btn = document.getElementsByClassName(className)[0];
  if (!state.valid.value) {
    btn.classList.add("disabled");
  }
  else {
    btn.classList.remove("disabled")
  }
};
const enableButton = (className, state) => {
  let btn = document.getElementsByClassName(className)[0];
  if (checkForFormCompletion(state)) {
    btn.classList.remove("disabled");
  }
};

class RegistrationComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: {
        value: null,
        typingTimeout: 0,
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
      emailVerified: {
        value: false,
      },
      valid: {
        value: false,
      }
    };
  }
  componentDidMount() {
    disableButton("submitBtn", this.state);
  }
  componentDidUpdate() {
    enableButton("submitBtn", this.state);
  }
  handleEmail(event) {
    if (this.state.email.typingTimeout) {
      clearTimeout(this.state.email.typingTimeout);
    }
    const emailState = {...this.state.email};
    emailState.value = event.target.value;
    //check for valid email
    //if invalid set the error for form
    emailState.error = emailValidator(emailState.value) ? null : {content: "Invalid Email", pointing: "below"};
    //set timeout to dynamically check typed in email
    emailState.typingTimeout = setTimeout(() => {
      if (!this.state.email.error) {
         authHelper(this.state.email.value)
          .then((response) => {
            //if email is unaivalable
            if (!response.data.available) {
              emailState.error = {content: response.data.message, pointing: "below"};
              this.setState({
                email: emailState,
                emailVerified: {
                  value: false,
                  error: "Email Taken"
                }
              });
            }
            else {
              this.setState({
                email: emailState,
                emailVerified: {
                  value: true,
                  error: null
                }
              });
            }
          })
          .catch((error) => {
            console.log(error.response);
            const {status, statusText} = error.response;
            emailState.error = {content: `${status}:  Unable to reach server and verify email`, pointing: "below"};
            this.setState({
              email: emailState,
              emailVerified: {
                value: false,
                error: "Server error verifying email"
              }
            });
          });
      }
      else {
        return;
      }
    }, 2500);
    this.setState({email: emailState});
  }

  handleFirstName(event) {
    const firstNameState = {...this.state.firstName};
    firstNameState.value = event.target.value;
    //validate name and length of at least one char
    const {error, valid} = nameValidator(firstNameState.value);
    if(!valid) {
      firstNameState.error = {content: error, pointing: "below"};
      this.setState({
        firstName: firstNameState
      });
    }
    else {
      firstNameState.error = null;
      this.setState({
        firstName: firstNameState
      });
    }
  }

  handleLastName(event) {
    const lastNameState = {...this.state.lastName};
    lastNameState.value = event.target.value;
    //validate last name as well
    const {error, valid} = nameValidator(lastNameState.value);
    if(!valid) {
      lastNameState.error = {content: error, pointing: "below"};
      this.setState({
        lastName: lastNameState
      });
    }
    else {
      lastNameState.error = null;
      this.setState({
        lastName: lastNameState
      });
    }
  }

  handlePassword(event) {
    const passwordReqs = `Password must be: At least 8 letters. One uppercase letter.One lowercase letter. And one number.`;
    const passwordState = {...this.state.password};
    passwordState.value = event.target.value;
    //validate password length and chars
    passwordState.error = passwordValidator([passwordState.value]) ? null : {content: passwordReqs, pointing: "below"};
    this.setState({
      password: passwordState
    });
  }

  handlePasswordConfirm(event) {
    const passwordConfirmState = {...this.state.passwordConfirm};
    passwordConfirmState.value = event.target.value;
    this.setState({
      passwordConfirm: passwordConfirmState
    }, () => {
      if (this.state.password.value === this.state.passwordConfirm.value) {
        passwordConfirmState.error = null
        this.setState({passwordConfirm: passwordConfirmState});
      }
      else {
        passwordConfirmState.error ={content: "Passwords do not match", pointing: "below"};
        this.setState({passwordConfirm: passwordConfirmState});
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(errors);
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
          <Button className="submitBtn" type="submit" onClick={ (e) => this.handleSubmit(e) }>Submit</Button>
        </Form>
      </Container>
    )
  }
}


export default RegistrationComponent;