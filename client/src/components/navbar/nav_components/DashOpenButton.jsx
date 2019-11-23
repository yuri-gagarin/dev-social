import React from "react";
import { Menu, Button, Icon } from "semantic-ui-react";

import {openDash} from "../helpers/toggleButtons";


const DashOpenButton = (props) => {
  const {authState} = props;
  if (authState.userLoggedIn) {
    return (
      <Menu.Item as={Button} onClick={openDash} data-test="open-dash-btn">
        <Icon name="dashboard">
        </Icon>
        <span>Open Dashboard</span>
      </Menu.Item>
    );
  }
  else {
    return null;
  }

};

export default DashOpenButton;