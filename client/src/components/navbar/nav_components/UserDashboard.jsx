import React from "react";
import PropTypes from "prop-types";

import {Menu} from "semantic-ui-react";



//returns a sidebar with a dashboard for logged in users
const UserDashboard = (props) => {
  const {authState, navState, closeDash} = props;
  if (authState.isLoggedIn) {
    return(
      <Sidebar
        as={Container}
        animation="overlay"
        visible={navState.dashOpen}
        direction="top"
        id = {""} >
        <Menu.Item
          as={"a"}
          onClick={closeDash} >
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

