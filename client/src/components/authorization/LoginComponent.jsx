import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import {setTypingTimeout, checkTyping, checkForFormCompletion, 
        disableButton, enableButton} from "./helper_methods/formHelper.js";
import emailValidator from "../../helpers/emailValidator.js";


class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: null,
      },
      password: {
        value: null,
      },
      typing: {
        value: false,
      }
    };
    this.toValidate = ["email", "password"];
  }

  handleEmail(event) {

  }
  handlePassword(event) {
    
  }
  handleLogin(event) {
    event.preventDefault();
  }

  render() {
    return (
      <Container>
        <h3 className={""}>Login</h3>
        <Form>
          <Form.Input
            error={this.state.email.error}
            fluid
            placeholder="Email"
            onChange={ (e) => {this.handleEmail(e)} }
          />
          <Form.Input 
            error={this.state.password.error}
            fluid
            placeholder="Password"
            onChange={ (e) => {this.handPassword(e)} }
          />
          <Button className="loginButton" type ="submit" onClick={ () => {this.handleLogin} }>Login</Button>
        </Form>
      </Container>
    );
  }
};

export default LoginComponent;
