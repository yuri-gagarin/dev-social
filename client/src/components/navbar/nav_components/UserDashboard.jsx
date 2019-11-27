import React from "react";
import PropTypes from "prop-types";

import {Menu, Sidebar, Container, Icon} from "semantic-ui-react";
import {closeDash} from "../helpers/toggleButtons";

const makeUnderscoreString = (string) => {
  if(typeof string !== "string") {
    throw new TypeError(`Expected the argument to be a {string} instead saw ${typeof string}`);
  }
  return string.toLowerCase().replace(/[^0-9a-zA-Z]/g, '_');
}

const handleDashItemClick = (event) => {

};

//returns a sidebar with a dashboard for logged in users
const UserDashboard = (props) => {
  const {authState, navState} = props;
  const dashItems = props.navState.dashItems;
  if (authState.userLoggedIn) {
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
          data-test="close-dash-btn"
        >
          <Icon name="window close outline"></Icon>
          <div>Close</div>
        </Menu.Item>
        {
          dashItems.map((item) => {
            return (
              <div 
                className="" 
                key={item.key}
                onClick={handleDashItemClick} 
                data-value={makeUnderscoreString(item.content)} 
                data-test="user-dash-item"
              >
                <Icon name={item.iconName}></Icon>
                <span>{item.content}</span>
              </div>
            );
          })
        } 
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

