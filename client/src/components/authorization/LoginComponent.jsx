import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import {setTypingTimeout, checkTyping, checkForFormCompletion, 
        disableButton, enableButton} from "./helper_methods/formHelper.js";
import emailValidator from "../../helpers/emailValidator.js";
import passwordValidator from "../../helpers/passwordValidator.js";
import axios from "axios";


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
      },
      typingTimeout: {
        value: false,
      }
    };
    this.toValidate = ["email", "password"];
  }
  //lifecycle methods
  componentDidMount() {
    disableButton("loginButton");
  }
  componentDidUpdate() {
    if(!checkTyping(this)) {
      if(checkForFormCompletion(this, this.toValidate)) {
        enableButton("loginButton");
      }
      else {
        disableButton("loginButton");
      }
    }
  }
  componentWillUnmount() {
    if(this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }
  }

  //component methods
  handleEmail(event) {
    if (this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }

    if(!emailValidator(event.target.value)) {
      this.setState({
        email: {
          value: event.target.value,
          error: {content: "Invalid email", pointing: "below"},
        },
        typing: {
          value: true,
        },
        typingTimeout: {
          value: setTypingTimeout(this, 2000),
        }
      });
    }
    else {
      this.setState({
        email: {
          value: event.target.value,
          error: null,
        },
        typing: {
          value: true,
        },
        typingTimeout: {
          value: setTypingTimeout(this, 2000),
        }
      })
    }
  }
  handlePassword(event) {
    if (this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }

    if(!passwordValidator(event.target.value)) {
      this.setState({
        password: {
          value: event.target.value,
          error: {content: "Password must be: At least 8 letters. One uppercase letter. One lowercase letter. And one number.", pointing: "down"},
        },
        typing: {
          value: true,
        },
        typingTimeout: {
          value: setTypingTimeout(this, 2000),
        }
      });
    }
    else {
      this.setState({
        password: {
          value: event.target.value,
          error: null,
        },
        typing: {
          value: true,
        },
        typingTimeout: {
          value: setTypingTimeout(this, 2000),
        }
      });
    }
  }

  handleLogin(event) {
    const options = {
      method: "POST",
      url: "/api/users/login",
      data: {
        email: this.state.email.value,
        password: this.state.password.value,
      }
    };
    axios(options)
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
        <h3 className={""}>Login</h3>
        <Form>
          <Form.Input
            error={this.state.email.error}
            fluid
            label="Email"
            placeholder="Email"
            onChange={ (e) => {this.handleEmail(e)} }
          />
          <Form.Input 
            error={this.state.password.error}
            fluid
            label="Password"
            placeholder="Password"
            type="password"
            onChange={ (e) => {this.handPassword(e)} }
          />
          <Button className="loginButton" onClick={ () => {this.handleLogin} }>Login</Button>
        </Form>
      </Container>
    );
  }
};

export default LoginComponent;
