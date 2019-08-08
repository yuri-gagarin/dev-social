import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";

const NavbarDesktop = ({ leftItems, rightItems, children }) => {
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
    </Sidebar.Pushable>
  );
};

export default NavbarDesktop;