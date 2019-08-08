import React from "react";
import {connect} from "react-redux";
import AuthorizationComponent from "./components/authorization/AuthorizationComponent.jsx";
import {test, cancelTest} from "./actions/appAction.js";
import {registerUserTest, registerUser} from "./actions/authActions.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import WelcomeComponent from "./components/welcome_page/WelcomeComponent.jsx";
import { Container, Responsive, Segment } from "semantic-ui-react";


//let homeImg = document.getElementById("home");
//homeImg.src = homeIcon;

const leftNav = [
  {as: "a", content: "Home", key: "home", onClick: () => console.log(this) },
  {as: "a", content: "Users", key: "users", onClick: () => console.log(this) },
];
const rightNav = [
  {as: "a", content: "Login", key: "login", onClick: () => console.log(this) },
  {as: "a", content: "Register", key: "register", onClick: () => console.log(this) },
];


class App extends React.Component {
  constructor() {
    super();
    this.testRedux = this.testRedux.bind(this);
    this.cancelTest = this.cancelTest.bind(this);
    this.registerUserTest = this.registerUserTest.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }
  testRedux(e) {
    console.log(this)
    this.props.test();
  }
  cancelTest(e) {
    console.log(this)
    this.props.cancelTest();
  }
  registerUserTest(e) {
    const newUser = {
      name: "yuriy",
      email: "bob@mail.com",
      password: "password",
      passwordConfirm: "password"
    }    
    this.props.registerUserTest(newUser);
  }
  registerUser(e) {
    const newUser ={
      name: "yuriy",
      email: "yuriy@mail.com",
      lastName: "super",
      password: "password",
      passwordConfirm: "password",
    };
    this.props.registerUser(newUser)
  }
  render() {
    return (
      <Navbar
        leftItems = {leftNav}
        rightItems = {rightNav}
        children = {
          <div>
            <Responsive maxWidth={768}>
              <Segment inverted>
                Visible only if display is <code>768px</code> and lower
              </Segment>
            </Responsive>
            <Responsive minWidth={769}>
              <Segment>
                Visivle only if display is <code>769px</code> and higher
              </Segment>
            </Responsive>
            <Router>
              <Route exact path="/" component={WelcomeComponent} />
              <Route path="/authorize" component={AuthorizationComponent} />
            </Router>
            <button onClick={this.testRedux}>TEST REDUX</button>
            <button onClick={this.cancelTest}>CANCEL TEST</button>
            <button onClick={this.registerUserTest}>REGISTER TEST</button>
            <button onClick={this.registerUser}>REGISTER USER</button>
          </div>
        }
      >
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    testState: state.test,
    authState: state.auth,
    errorState: state.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    test: () => dispatch(test()),
    cancelTest: () => dispatch(cancelTest()),
    registerUserTest: (newUserData) => dispatch(registerUserTest(newUserData)),
    registerUser: (newUserData) => dispatch(registerUser(newUserData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);