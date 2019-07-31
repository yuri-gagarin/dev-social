import React, {Component} from "react";
import {Container, Form, Button} from "semantic-ui-react";
import style from "../../assets/stylesheets/authorization/registration.scss";
import emailValidator from "../../helpers/emailValidator";
import nameValidator from "../../helpers/nameValidator";

class RegistrationComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: {},
      firstName: {},
      lastName: {},
      password: {}
    };
  }

  handleEmail(event) {
    let emailState = {...this.state.email};
    emailState.email = event.target.value;
    emailState.error = emailValidator(emailState.email) ? null : {content: "Invalid Email", pointing: "below"};
    this.setState({email: emailState}, () =>{
      console.log(this.state.email);
    });
  }

  handleFirstName(event) {
    let firstNameState = {...this.state.firstName};
    firstNameState.value = event.target.value;
    const {error, valid} = nameValidator(firstNameState.value);
    console.log(error);
    console.log(valid);
    if(!valid) {
      firstNameState.error = {content: error, pointing: "below"};
      this.setState({
        firstName: firstNameState
      })
    }
    else {
      firstNameState.error = null;
      this.setState({
        firstName: firstNameState
      });
    }

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
          <Form.Field>
            <label>Last Name</label>
            <input placeholder="Last Name"></input>
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder="Password"></input>
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <input placeholder="Confirm Password"></input>
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    )
  }
}






































export default RegistrationComponent;