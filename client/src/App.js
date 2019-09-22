import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import MainNav from "./components/navbar/MainNav.jsx";
import ErrorComponent from "./components/error/ErrorComponent.jsx";
import WelcomeComponent from "./components/welcome_page/WelcomeComponent.jsx";
import AuthorizationComponent from "./components/authorization/AuthorizationComponent.jsx";
import PostIndexComponent from "./components/posts/PostsIndexComponent.jsx";
import Footer from "./components/footer/Footer.jsx";
//redux and routing
import {connect} from "react-redux";
import store from "./redux/store.js";
import {Route, withRouter } from "react-router-dom";


import jwtDecode from "jwt-decode";
import {setUser, logoutUser} from "./redux/actions/authActions.js";

//check for a user login
function setInitialCredentials(jwtToken, store, history) {

  if(jwtToken) {
    const currentUser = jwtDecode(jwtToken)
    if (currentUser.exp < Date.now() / 1000) {
      store.dispatch(logoutUser(currentUser, history));
    }
    else {
      store.dispatch(setUser(currentUser));
    }
  }
  else {
    store.dispatch(setUser("guest"))
  }
}


class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const history = this.props.history;
    setInitialCredentials(localStorage.jwtToken, store, history);
  }

  

  render() {
    return (
      <Fragment>
          <MainNav>
            <ErrorComponent />
            <Route exact path="/" component={WelcomeComponent} />
            <Route path="/(login|register)/" component={AuthorizationComponent} />
            <Route path="/posts" component={PostIndexComponent} />
          </MainNav>
          <Footer></Footer>
      </Fragment>
    );
  }
}
App.propTypes = {
  history: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    testState: state.test,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));