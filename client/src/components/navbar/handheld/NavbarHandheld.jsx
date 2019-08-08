import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";


const NavbarHandheld = (
  { 
    children, 
    leftItems, 
    leftInnerItems, 
    rightItems, 
    onPusherClick, 
    onToggle,
    onLeftToggle,
    onLeftInnerToggle, 
    visible,
    leftVisible,
  }
  ) => {

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={leftVisible}
        style={{width: "100vw", height: "100vh"}}
      >
      <Menu.Item  onClick={onLeftToggle}>
        <Icon name="arrow left"></Icon>
        Back
      </Menu.Item>
      { leftItems.map((item) => <Menu.Item {...item}></Menu.Item>) }
      </Sidebar>

      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={ {height: "100vh"} }
        >
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item onClick={onLeftToggle}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Menu position="right">
              {rightItems.map((item) => <Menu.Item {...item} /> )}
            </Menu.Menu>
          </Menu>
        {children}
      </Sidebar.Pusher>

    </Sidebar.Pushable>
  );
};

export default NavbarHandheld;