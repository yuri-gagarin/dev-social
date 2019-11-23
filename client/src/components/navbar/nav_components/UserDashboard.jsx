import React from "react";
import PropTypes from "prop-types";

import {Menu} from "semantic-ui-react";

import {closeDash} from "../helpers/toggleButtons";

//returns a sidebar with a dashboard for logged in users
const UserDashboard = (props) => {
  const {authState, navState} = props;
  if (authState.isLoggedIn) {
    return(
      <Sidebar
        as={Container}
        animation="overlay"
        visible={navState.dashOpen}
        direction="top"
        id="" 
        data-test="user-dash"
      >
        <Menu.Item
          as="a"
          onClick={closeDash} 
          data-test="close-dash-clikable"
        >
          <Icon name="window close outline"></Icon>
          <div>Close</div>
        </Menu.Item>
      </Sidebar>
    )
  }
  else {
    return null;
  }
};

UserDashboard.propTypes = {
  navState: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
};

export default UserDashboard;

