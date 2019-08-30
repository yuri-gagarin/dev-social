import React, {Component} from "react";
import {Container, Form, Button, Message} from "semantic-ui-react";
import PropTypes from "prop-types";
//form helpers
import displayFormErrors from "./helper_methods/displayFormErrors.js";
import {setTypingTimeout, checkTyping, checkForFormCompletion, 
        disableButton, enableButton} from "./helper_methods/formHelper.js";
//validators
import emailValidator from "../../helpers/emailValidator.js";
import passwordValidator from "../../helpers/passwordValidator.js";


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
      },
      errors: null,
    };
    this.toValidate = ["email", "password"];
  }
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
  handleEmail = (event) => {
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
  handlePassword = (event) => {
    if (this.state.typingTimeout.value) {
      clearTimeout(this.state.typingTimeout.value);
    }

    if(!passwordValidator(event.target.value)) {
      this.setState({
        password: {
          value: event.target.value,
          error: {content: "Password must be: At least 8 letters. One uppercase letter. One lowercase letter. And one number.",pointing: "below"},
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

  handleLogin = () => {
    const userData =  {
      email: this.state.email.value,
      password: this.state.password.value,
    };
    this.props.handleLogin(userData, this.props.history);
  }

  render() {
    const {errors} = this.state;
    return (
      <Container>
        <h3 className={""}>Login</h3>
        <Form error>
          <Form.Input
            error={this.state.email.error}
            fluid
            label="Email"
            placeholder="Email"
            onChange={(e) => this.handleEmail(e)}
          />
          <Form.Input 
            error={this.state.password.error}
            fluid
            label="Password"
            placeholder="Password"
            type="password"
            onChange={(e) => this.handlePassword(e)}
          />
          {displayFormErrors(errors)}
          <Button className="loginButton" onClick={ (e) => {this.handleLogin(e)} }>Login</Button>
        </Form>
      </Container>
    );
  }
};

LoginComponent.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default LoginComponent;
