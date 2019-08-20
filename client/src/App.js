import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import AuthorizationComponent from "./components/authorization/AuthorizationComponent.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainNav from "./components/navbar/MainNav.jsx";
import WelcomeComponent from "./components/welcome_page/WelcomeComponent.jsx";
import Footer from "./components/footer/Footer.jsx";

const leftNav = [
  {as: "a", content: "News", key: "news",},
  {as: "a", content: "Topics", key: "topics" },
  {as: "a", content: "Posts", key: "posts" },
  {as: "a", content: "Users", key: "users"},
];
const rightNav = [
  {as: "a", content: "Login", key: "login", onClick: () => console.log(this) },
  {as: "a", content: "Register", key: "register", onClick: () => console.log(this) },
];


class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <MainNav
          leftItems = {leftNav}
          rightItems = {rightNav} >
            <Router>
              <Route exact path="/" component={WelcomeComponent} />
              <Route path="/authorize" component={AuthorizationComponent} />
            </Router>
        </MainNav>
        <Footer></Footer>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};

export default connect(mapStateToProps, null)(App);