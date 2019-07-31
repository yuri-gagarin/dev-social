import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import style from "../../assets/stylesheets/authorization/registration.scss";
import emailValidator from "../../helpers/emailValidator.js";
import nameValidator from "../../helpers/nameValidator.js";
import passwordValidator from "../../helpers/passwordValidator.js";
import authHelper from "../../helpers/authHelper.js";

class RegistrationComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: {
        typing: false,
        typingTimeout: 0
      },
      firstName: {},
      lastName: {},
      password: {},
      passwordConfirm: {},
    };
  }

  handleEmail(event) {
    const self = this;
    if (this.state.email.typingTimeout) {
      clearTimeout(this.state.email.typingTimeout);
    }
    const emailState = {...this.state.email};
    emailState.value = event.target.value;
    
    //check for valid email
    //if invalid set the error for form
    emailState.error = emailValidator(emailState.value) ? null : {content: "Invalid Email", pointing: "below"};
    emailState.typingTimeout = setTimeout(() => {
      emailState.typing = false;
      self.setState({
        email: emailState
      }, () => {
        console.log("Here we fetch")
        console.log(this.state.email.error)
        if (!this.state.email.error) {
          console.log("Now we can fetch");
        }
        else {
          console.log("invalid email")
          return;
        }
      });
    }, 5000);
    emailState.typing = true;
    this.setState({email: emailState});
    /*
    if (!this.state.email.error) {
      authHelper(this.state.email.value)
        .then((respose) => {
          console.log(response);
        });
    }
    */
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
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    )
  }
}

export default RegistrationComponent;