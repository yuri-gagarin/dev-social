import React, {Fragment} from "react";
import PropTypes from "prop-types";

import {Menu, Button} from "semantic-ui-react";

import {withRouter} from "react-router-dom";


const NavAuthComponent = (props) => {
  const {authState, history} = props;
  
  const toggleLogin = () => {
    history.push("/login");
  };
  const toggleRegister = () => {
    history.push("/register")
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
  history: PropTypes.object.isRequired,
};



export default withRouter(NavAuthComponent);



