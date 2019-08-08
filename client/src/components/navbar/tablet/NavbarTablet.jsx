import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";

const NavbarTablet = (
  {
    children, 
    leftItems, 
    leftInnerItems,
    rightItems, 
    onPusherClick,
    onLeftToggle, 
    onLeftExpandToggle, 
  } 
  ) => {
  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher>
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
          </Menu.Item>
            { leftItems.map((item) => <Menu.Item {...item} />) }
          <Menu.Menu position="right">
            { rightItems.map((item) => <Menu.Item {...item} />) }
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
      {children}
    </Sidebar.Pushable>
  );
};

export default NavbarTablet;