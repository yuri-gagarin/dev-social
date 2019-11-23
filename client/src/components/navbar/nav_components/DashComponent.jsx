import React from "react";
import { Menu, Button, Icon } from "semantic-ui-react";

import {openDash} from "../helpers/toggleButtons";


const DashComponent = (props) => {
  const {authState} = props;
  if (authState.loggedIn) {
    return (
      <Menu.Item as={Button} onClick={openDash}>
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

export default DashComponent;