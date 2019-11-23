import React, {Fragment} from "react";
import PropTypes from "prop-types";

import {Menu, Button} from "semantic-ui-react";

import {withRouter} from "react-router-dom";

//for testing
export const NavAuthComponent = (props) => {
  const {authState, history, logoutUser} = props;
  
  const toggleLogin = () => {
    history.push("/login");
  };
  const toggleRegister = () => {
    history.push("/register")
  };
  const toggleLogout = () => {
    const userData = authState.user;    
    logoutUser(userData, history);
  };
  const toggleMyProfile = () => {

  };

  if(authState.userLoggedIn) {
    return (
    <Fragment>
      <Menu.Item as={Button} onClick={toggleLogout} data-test="logout-btn">
        <span>Logout</span>
      </Menu.Item>
      <Menu.Item as={Button} onClick={toggleMyProfile} data-test="profile-btn">
        <span>My Profile</span>
      </Menu.Item>
    </Fragment>
    );
  }
  else {
    return(
      <Fragment>
        <Menu.Item as={Button} onClick={toggleLogin} data-test="login-btn">
          <span>Login</span>
        </Menu.Item>
        <Menu.Item as={Button} onClick={toggleRegister} data-test="register-btn">
          <span>Register</span>
        </Menu.Item>
      </Fragment>
    );
  }
};

NavAuthComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};



export default withRouter(NavAuthComponent);



