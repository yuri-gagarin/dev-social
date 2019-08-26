import React, {Fragment} from "react";
import PropTypes from "prop-types";

import {Menu, Button} from "semantic-ui-react";

import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {logoutUser} from "../../../actions/authActions.js";
import {openDashboard, closeDasboard} from "../../../actions/navActions.js"; 

import jwtDecode from "jwt-decode";

const NavAuthComponent = (props) => {
  const {authState, history, toggleMyProfile, openDashboard, closeDasboard} = props;
  const toggleLogin = (history) => {
    history.push("/login");
  };
  const toggleRegister = () => {
    history.push("/register")
  };
  const toggleLogout = (history) => {
    const currentUser = jwtDecode(localStorage.jwtToken);
    logoutUser(currentUser, history)
  };

  if(authState.loggedIn) {
    return (
    <Fragment>
      <Menu.Item as={Button} onClick={toggleLogout}>
        <span>Logout</span>
      </Menu.Item>
      <Menu.Item as={Button} onClick={toggleMyProfile}>
        <span>My Profile</span>
      </Menu.Item>
      <Menu.item as={Button} onClick={openDashboard}>
        <span>Dashboard</span>
      </Menu.item>
    </Fragment>
    );
  }
  else {
    return(
      <Fragment>
        <Menu.Item as={Button} onClick={toggleLogin}>
          <span>Login</span>
        </Menu.Item>
        <Menu.Item as={Button} onClick={toggleRegister}>
          <span>Register</span>
        </Menu.Item>
      </Fragment>
    );
  }
};

NavAuthComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  navsState: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  openDashboard: PropTypes.func.isRequired,
  closeDasboard: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    navState: state.nav,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleMyProfile: () => {},
    openDashboard: () => dispatch(openDashboard()),
    closeDasboard: () => dispatch(closeDasboard()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavAuthComponent));



